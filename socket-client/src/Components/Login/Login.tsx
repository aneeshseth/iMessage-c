import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleLogin = async () => {
    const res = await axios.post("http://localhost:3500/login", {
      email: email,
      password: password,
    });
    const data = await res.data;
    return data;
  };
  const checkDisabled = () => {
    if (email === "" || password === "") {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email ID"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password"
      />
      <button
        disabled={checkDisabled()}
        onClick={() => {
          handleLogin()
            .then((data) => {
              console.log(data);
              navigate("/chats");
            })
            .catch(() => {
              navigate("/");
            });
        }}
      >
        Login
      </button>
      <Link to="/">Signup Instead?</Link>
    </>
  );
}

export default Login;
