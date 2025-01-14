import RoomIcon  from '@mui/icons-material/Room';
import CancelIcon from '@mui/icons-material/Cancel';
import {  useRef, useState } from "react";
import "./login.css";
import apiRequest from '../../lib/apiRequest';

export default function Login({ myStorage,setCurrentUsername ,setShowLogin}) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await apiRequest.post("/user/login", user);
      setCurrentUsername(res.data.username);
      myStorage.setItem('user', res.data.username);
      setSuccess(true)
      window.location.reload();
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <RoomIcon className="logoIcon" />
        <span>MapPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {success && (
        <span className="success">Successfull. logged In!</span>
      )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CancelIcon className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}
