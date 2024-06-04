import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Users from './pages/users/Users';
import Login from './pages/login/Login';
import CreateUser from './pages/users/CreateUser';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  // Route protection setup
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/home' element={<Users/>} />
        <Route path='/new' element={
          // user must be logged in to access this page
          <ProtectedRoute>
            <CreateUser/>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
