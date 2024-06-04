import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import logo from "../../images/miliki-boda.png";

const Login = () => {
  const [ credentials, setCredentials ] = useState({
    email: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({type:"LOGIN_START"});
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({type: "LOGIN_SUCCESS", payload: res.data});
      navigate("/home");
    } catch (err) {
      dispatch({type:"LOGIN_FAILURE", payload: err.response.data});
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <div className="imgHolder">
          <img src={logo} alt="" />
        </div>
        {error && <span>{error.message}</span>}
        <input 
          type="email" 
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="lInput"
          required 
        />
        <input 
          type="password" 
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput" 
          required
        />
        <button 
          disabled={
            loading || !credentials.email || !credentials.password
          } 
          onClick={handleClick} className="lButton"
        >
          Login
        </button>
        <Link to="/home" style={{ 
          color: "#ff9f0e",
          cursor: "pointer"
        }}><b>Home </b></Link>
      </div>
    </div>
  )
};

export default Login;