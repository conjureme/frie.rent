import Plushie from './components/Plushie';

function App() {
  return (
    <div className='min-h-screen bg-base-100'>
      <div className='fixed inset-0 w-full h-full'>
        <Plushie gravity={[0, -40, 0]} position={[0, 0, 20]} />
      </div>
    </div>
  );
}

export default App;
