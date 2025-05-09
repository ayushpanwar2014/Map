import "./register.css"
import RoomIcon  from '@mui/icons-material/Room';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRef, useState } from "react";
import apiRequest from "../../lib/apiRequest";

const register = ({setShowRegister}) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await apiRequest.post("/user/register", newUser);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className="registerContainer">
    <div className="logo">
      <RoomIcon className="logoIcon" />
      <span>MapPin</span>
    </div>
    <form onSubmit={handleSubmit}>
      <input autoFocus placeholder="username" ref={usernameRef} />
      <input type="email" placeholder="email" ref={emailRef} />
      <input
        type="password"
        min="6"
        placeholder="password"
        ref={passwordRef}
      />
      <button className="registerBtn" type="submit">
        Register
      </button>
      {success && (
        <span className="success">Successfull. You can login now!</span>
      )}
      {error && <span className="failure">Something went wrong!</span>}
    </form>
    <CancelIcon
      className="registerCancel"
      onClick={() => setShowRegister(false)}
    />
  </div>
  )
}

export default register
