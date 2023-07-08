import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [res, setRes] = useState<object>({});
  const [imageUrls, setImageUrls] = useState<string>("");
  const handleSignup = async () => {
    const res = await axios.post("http://localhost:3500/signup", {
      username: username,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      profile_pic: imageUrls,
    });
    const data = await res.data;
    return data;
  };
  const handleSelectFile = (e: any) => setFile(e.target.files[0]);
  const handleUpload = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      const allowedFormats = ["png", "jpg", "jpeg"];

      if (file) {
        const fileType = file.name.split(".").pop()?.toLowerCase();
        data.append("my_file", file);

        if (fileType && allowedFormats.includes(fileType)) {
          const response = await axios.post(
            "http://localhost:3500/upload",
            data
          );
          setRes(response.data);
          setImageUrls(response.data.url);
        } else {
          alert("Please select a PNG, JPG, or JPEG file.");
        }
      } else {
        alert("Please select a file.");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkDisabled = () => {
    if (
      username === "" ||
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
      />
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="first-name"
      />
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="last-name"
      />
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
      <div className="App">
        <h5>Select Profile Picture below:</h5>
        {file && <center>{file.name}</center>}
        <input
          id="file"
          type="file"
          onChange={handleSelectFile}
          multiple={false}
        />
        {file && (
          <div className="button-container">
            <button onClick={handleUpload} className="btn-green">
              {loading ? "Uploading" : "Set Profile Picture"}
            </button>
            <div className="done">
              {imageUrls === "" ? "No image uploaded" : "Done!"}
            </div>
          </div>
        )}
      </div>
      <button
        disabled={checkDisabled()}
        onClick={() => {
          handleSignup()
            .then(() => {
              navigate("/chats");
            })
            .catch((err) => {
              console.log(err);
              alert("Invalid!");
              navigate("/");
            });
        }}
      >
        Signup
      </button>
      <Link to="/login">Login Instead?</Link>
    </>
  );
}

export default Signup;
