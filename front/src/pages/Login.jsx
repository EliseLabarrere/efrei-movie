import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import { API_BASE_URL } from "../utils/api";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      setToken(data.access_token);
      toast.success("Connexion réussie ! 🎉");
      navigate("/profile");
    } else {
      toast.error("Erreur de connexion : " + data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn btn-primary" type="submit">Se connecter</button>
    </form>
  );
};

export default Login;
