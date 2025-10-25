import { Icon } from '@iconify/react';

export const SocialLinks = () => {
  const links = [
    {
      name: 'last.fm',
      url: 'https://www.last.fm/user/tyster115',
      icon: 'typcn:social-last-fm',
    },
    {
      name: 'spotify',
      url: 'https://open.spotify.com/user/tr8ftia4402gx99sy4upfk36c',
      icon: 'mdi:spotify',
    },
    {
      name: 'steam',
      url: 'https://steamcommunity.com/id/tyster1/',
      icon: 'mdi:steam',
    },
  ];

  return (
    <div className='flex gap-2'>
      {links.map((link) => (
        <div className='tooltip' data-tip={link.name}>
          <a
            key={link.name}
            href={link.url}
            target='_blank'
            rel='noopener noreferrer'
            className='w-10 h-10 rounded-full bg-base-200/80 backdrop-blur-sm hover:bg-base-300/80 transition-colors flex items-center justify-center text-base-content/60 hover:text-base-content shadow-lg'
            aria-label={link.name}
          >
            <Icon icon={link.icon} className='w-5 h-5' />
          </a>
        </div>
      ))}
    </div>
  );
};
