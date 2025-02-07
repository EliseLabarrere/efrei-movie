import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { API_BASE_URL } from "../utils/api";
import { IoIosCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reservation`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Erreur: Les réservations ne sont pas un tableau", data);
          setReservations([]);
          return;
        }

        const enrichedReservations = await Promise.all(
          data.map(async (reservation) => {
            const movieRes = await fetch(
              `${API_BASE_URL}/movies/movie-details?movie_id=${reservation.idFilm}`,
              {
                headers: { Authorization: `Bearer ${getToken()}` },
              }
            );
            const movie = await movieRes.json();
            return { ...reservation, movie };
          })
        );

        setReservations(enrichedReservations);
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
      }
    };

    fetchProfile();
    fetchReservations();
  }, []);

  // Fonction de confirmation AVANT suppression
  const confirmDeleteReservation = (session, idFilm) => {
    toast(
      ({ closeToast }) => (
        <div className="toast-content">
          <p className="toast-text">Confirmer la suppression ?</p>
          <div className="toast-btns">
            <button
              className="btn btn-primary btn-small"
              onClick={() => {
                handleDeleteReservation(session, idFilm);
                closeToast();
              }}
            >
              Supprimer
            </button>
            <button
              className="btn btn-secondary btn-small"
              onClick={closeToast}
            >
              Annuler
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  // Fonction pour annuler une réservation
  const handleDeleteReservation = async (session, idFilm) => {
    try {
      const token = getToken();
      if (!token) {
        console.error("Erreur: Aucun token trouvé !");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/reservation`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ session, idFilm }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Réservation annulée :", data);

        // Met à jour l'état pour enlever la réservation annulée
        setReservations((prevReservations) =>
          prevReservations.filter((res) => res.session !== session || res.idFilm !== idFilm)
        );
      } else {
        console.error("Erreur lors de la suppression :", data);
      }
    } catch (error) {
      console.error("Erreur serveur lors de la suppression :", error);
    }
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <section className="column">
      <article>
        <h1>Profil</h1>
        <p><strong>Username:</strong> {user.username}</p>
      </article>

      <article>
        <h1>Réservations à venir</h1>
        {reservations.length === 0 ? <p>Aucune réservation</p> : (
          <ul className="list-overflow">
            {reservations.map((res) => (
              <li className="card-portrait" key={res.id}>
                <IoIosCloseCircle
                  className="card-portrait__remove cursor-pointer text-red-500 text-2xl"
                  onClick={() => confirmDeleteReservation(res.session, res.idFilm)}
                />
                <p className="card-portrait__top-left">
                  {new Date(res.session).toLocaleDateString("fr-FR")} -
                  {new Date(res.session).toLocaleTimeString("fr-FR", { hour: "2-digit" }).replace(":", "h")}
                </p>
                <img
                  src={`https://image.tmdb.org/t/p/w220_and_h330_face${res.movie.poster_path}`}
                  alt={`Affiche du film ${res.movie.title}`}
                  className="card-portrait__img"
                />
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
};

export default Profile;
