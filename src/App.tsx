import './App.css';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import SignInPage from './pages/SignInPage/SignInPage';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/signUpPage" element={<SignUpPage />} />
          <Route path="/homePage" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
