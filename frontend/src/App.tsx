import '@styles/App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from '@components/Navbar/Navbar';
import Regist from '@components/User/Regist';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className='flex'>
        {/* Desktop Navigation bar용 공간 */}
        <div className='hidden lg:block w-56'/>
        <div className='flex-grow'>

          {/* 여기서 부터 */}
          <BrowserRouter>
            <Routes>
              <Route path="/user/regist/email" element={<Regist/>}/>
            </Routes>
          </BrowserRouter>
          {/* 여기까지 컨텐츠 */}

        </div> 
      </div>
    </div>
  );
}

export default App;
