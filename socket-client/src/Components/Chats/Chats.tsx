import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

function Chats() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("http://localhost:3500/verify", {
        withCredentials: true,
      });
      const data = await res.data;
      return data;
    }
    fetchData()
      .then((data) => {
        setUserEmail(data.email);
      })
      .catch(() => {
        navigate("/");
      });
  });
  async function handleLogout() {
    const res = await axios.get("http://localhost:3500/logout");
    const data = await res.data;
    return data;
  }
  return (
    <button
      onClick={() => {
        handleLogout()
          .then(() => {
            navigate("/");
          })
          .catch(() => {
            navigate("/");
          });
      }}
    >
      Logout
    </button>
  );
}

export default Chats;
