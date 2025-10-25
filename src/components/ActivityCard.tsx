import { useEffect, useState } from 'react';
import frierenBackground from '../assets/frieren-ost-spotify.jpg';

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  global_name: string;
  display_name: string;
}

interface Activity {
  id: string;
  name: string;
  type: number;
  application_id?: string;
  details?: string;
  state?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

interface SpotifyData {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
}

interface ActivityData {
  discord_user: DiscordUser;
  activities: Activity[];
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  listening_to_spotify: boolean;
  spotify: SpotifyData | null;
}

interface ActivityResponse {
  success: boolean;
  data: ActivityData;
  cached?: boolean;
  cacheAge?: number;
}

const STATUS_COLORS = {
  online: '#43b581',
  idle: '#faa61a',
  dnd: '#f04747',
  offline: '#747f8d',
};

export const ActivityCard = () => {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = async () => {
    try {
      const response = await fetch('/.netlify/functions/activity');
      if (!response.ok) {
        throw new Error('failed to fetch activity');
      }
      const result: ActivityResponse = await response.json();
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError('failed to load status');
      }
    } catch (err) {
      console.error('error fetching activity:', err);
      setError('failed to load status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className='bg-base-200/80 backdrop-blur-sm rounded-lg shadow-lg p-4 w-80 h-[120px]'>
        <div className='flex items-center gap-3'>
          <div className='w-14 h-14 rounded-full bg-base-300 animate-pulse' />
          <div className='flex flex-col gap-2'>
            <div className='w-24 h-4 bg-base-300 rounded animate-pulse' />
            <div className='w-32 h-3 bg-base-300 rounded animate-pulse' />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const {
    discord_user,
    discord_status,
    activities,
    listening_to_spotify,
    spotify,
  } = data;
  const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=128`;

  const currentActivity = activities[0];
  const isPlaying = listening_to_spotify && spotify;

  const getElapsedTime = (timestamp: number) => {
    const elapsed = Date.now() - timestamp;
    const totalMinutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `for ${hours}h ${minutes}m`;
    }
    return `for ${minutes}m`;
  };

  return (
    <div className='relative bg-base-200/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden w-90 h-[120px]'>
      <div
        className='absolute inset-0 bg-cover bg-center opacity-15'
        style={{
          backgroundImage: `url(${
            isPlaying && spotify?.album_art_url
              ? spotify.album_art_url
              : frierenBackground
          })`,
        }}
      />

      <div className='relative p-4 h-full'>
        <div className='flex items-center gap-3 h-full'>
          <div className='relative shrink-0'>
            <img
              src={avatarUrl}
              alt={discord_user.display_name}
              className='w-14 h-14 rounded-full'
            />
            <div
              className='absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-base-200'
              style={{ backgroundColor: STATUS_COLORS[discord_status] }}
            />
          </div>

          <div className='flex-1 min-w-0'>
            <div className='font-semibold text-base-content'>
              {discord_user.display_name || discord_user.global_name}
            </div>
            <div className='text-sm text-base-content/60'>
              @{discord_user.username}
            </div>
          </div>

          <div className='flex-1 min-w-0 text-right'>
            {isPlaying && spotify ? (
              <div className='text-sm'>
                <div className='text-base-content/60 text-xs text-center'>
                  listening to spotify !
                </div>
                <div className='text-base-content font-medium truncate mt-0.5'>
                  {spotify.song}
                </div>
                <div className='text-base-content/60 truncate'>
                  by {spotify.artist}
                </div>
              </div>
            ) : currentActivity ? (
              <div className='text-sm'>
                <div className='text-base-content/60 text-xs'>
                  playing a game !
                </div>
                <div className='text-base-content font-medium truncate mt-0.5'>
                  {currentActivity.name}
                </div>
                {currentActivity.timestamps?.start && (
                  <div className='text-base-content/60 truncate'>
                    {getElapsedTime(currentActivity.timestamps.start)}
                  </div>
                )}
              </div>
            ) : (
              <div className='text-sm text-base-content/60'>
                {discord_status === 'online' ? 'online' : discord_status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
