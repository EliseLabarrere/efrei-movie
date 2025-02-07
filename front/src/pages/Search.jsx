import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { getToken } from "../utils/auth";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query"); // Récupère ?query=... dans l'URL
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setMovies([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error("Erreur: Aucun token trouvé !");
          setError("Vous devez être connecté pour voir les résultats.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/movies/search-movie?query=${encodeURIComponent(query)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setMovies(data.results || []);
        } else {
          console.error("Erreur API:", data.message);
          setError("Aucun film trouvé.");
        }
      } catch (err) {
        console.error("Erreur lors de la recherche :", err);
        setError("Une erreur s'est produite.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Résultats pour "{query}"</h1>

      {loading && <p>Chargement des films...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-gray-900 text-white p-4 rounded-lg">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-80 object-cover rounded-lg"
            />
            <h2 className="text-xl font-bold mt-2">{movie.title}</h2>
            <p className="text-gray-400 text-sm">{movie.release_date}</p>
            <Link to={`/movie/${movie.id}`} className="text-blue-400 hover:underline">
              Voir plus
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
