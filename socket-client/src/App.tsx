import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";
import Chats from "./Components/Chats/Chats";

function App() {
  return (
    <Routes>
      <Route path="/" Component={Signup} />
      <Route path="/login" Component={Login} />
      <Route path="/chats" Component={Chats} />
    </Routes>
  );
}

export default App;
