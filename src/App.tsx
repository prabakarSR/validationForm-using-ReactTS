import './App.css';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import SignInPage from './pages/SignInPage/SignInPage';
import ForgotPassword from './pages/ForgotPasswordPage/ForgotPassword';
import ResetPassword from './pages/ResetPasswordpage/ResetPassword';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/signUpPage" element={<SignUpPage />} />
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
