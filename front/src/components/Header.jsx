import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, removeToken } from "../utils/auth";
import { useState, useEffect } from "react";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Hook pour la navigation

  useEffect(() => {
    const checkAuth = () => {
      setLoggedIn(isAuthenticated());
    };

    const interval = setInterval(checkAuth, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    window.location.href = "/"; // Redirection après déconnexion
  };

  // Fonction qui met à jour l'URL à chaque frappe de touche
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === "") {
      navigate(`/`); // Si l'input est vide, affiche la page vide
    } else {
      navigate(`/search?query=${encodeURIComponent(query)}`); // Redirige dynamiquement
    }
  };

  return (
    <nav>
      {/* Input de recherche */}
      <input
        type="text"
        placeholder="Recherche"
        value={searchQuery}
        onChange={handleSearchChange} // L'URL change à chaque frappe
        required
      />

      <ul>
        {!loggedIn ? (
          <>
            <li className="btn btn-secondary"><Link to="/register">Créer un compte</Link></li>
            <li className="btn btn-primary"><Link to="/login">Connexion</Link></li>
          </>
        ) : (
          <>
            <li className="btn btn-secondary"><button onClick={handleLogout}>Déconnexion</button></li>
            <li className="btn btn-primary"><Link to="/profile">Mon compte</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
