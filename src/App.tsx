import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import SliderBar from './components/Slidebar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


function App() {

 

  return (
    <div>
      <Theme>
      <SliderBar  /> 
      <Outlet/>
        
      </Theme>

      <Toaster/>
    </div>
  );
}

export default App;
