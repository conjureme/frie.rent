import Plushie from './components/Plushie';
import { Particles } from './components/Particles';

function App() {
  return (
    <div className='min-h-screen bg-base-100 font-montserrat'>
      <Particles
        className='absolute inset-0'
        quantity={400}
        ease={80}
        color='#4e5a63'
        refresh
      />
      <div className='fixed inset-0 w-full h-full'>
        <Plushie gravity={[0, -40, 0]} position={[0, 0, 20]} />
      </div>
      <div className='fixed bottom-4 right-4 z-10'>
        <a
          href='https://sketchfab.com/3d-models/frieren-plushie-209c79c641164b38a81e145b6af3f890'
          target='_blank'
          rel='noopener noreferrer'
          className='text-base-content/60 hover:text-base-content transition-colors text-sm'
        >
          frieren-plushie.obj
        </a>
      </div>
    </div>
  );
}

export default App;
