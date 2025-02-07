import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";
import { getToken } from "../utils/auth";
import { Link } from "react-router-dom";

const Home = () => {
    const [nowPlaying, setNowPlaying] = useState([]);
    const [popular, setPopular] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async (endpoint, setter) => {
            try {
                const token = getToken();
                if (!token) {
                    console.error("Erreur: Aucun token trouvé !");
                    setError("Vous devez être connecté pour voir les films.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/movies/tmdb?endpoint=${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setter(data.results || []);
                } else {
                    console.error("Erreur API:", data.message);
                    setError("Impossible de charger les films.");
                }
            } catch (err) {
                console.error("Erreur lors du chargement des films :", err);
                setError("Une erreur s'est produite.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies("movie/now_playing", setNowPlaying);
        fetchMovies("movie/popular", setPopular);
        fetchMovies("movie/upcoming", setUpcoming);
    }, []);

    const renderMovies = (movies) => (
        <div className="list-overflow">
            {movies.map((movie) => (
                <li key={movie.id} className="card-portrait">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="card-portrait__img"
                    />
                    <h2>{movie.title}</h2>
                    <p>{movie.release_date}</p>
                    <Link to={`/movie/${movie.id}`} className="">
                        Voir plus
                    </Link>
                </li>
            ))}
        </div>
    );

    return (
        <div>
            {loading && <p>Chargement des films...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <section>
                <h1>🎬 Films à la une</h1>
                {renderMovies(nowPlaying)}
            </section>

            <section>
                <h1>🔥 Films populaires</h1>
                {renderMovies(popular)}
            </section>

            <section>
                <h1>🎟️ Films à venir</h1>
                {renderMovies(upcoming)}
            </section>
        </div>
    );
};

export default Home;
