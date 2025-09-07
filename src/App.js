//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import HomePage from './pages/HomePage';

function App() {
  return (
    <div style={{ }}>
      <div>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />}/>
            {/* <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/checkCarSpot" element={<CheckCarSpot />} />
            <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
      
    </div>
  );
}

export default App;
