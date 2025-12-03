import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SeriesPlayer() {
  const router = useRouter();
  const { id } = router.query;

  const [movie, setMovie] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const res = await fetch("/movies.json");
      const list = await res.json();

      const item = list.find((m) => m.id == id);
      setMovie(item);
    }

    load();
  }, [id]);

  const handleEnded = () => {
    if (movie?.episodios && current < movie.episodios.length - 1) {
      setCurrent(current + 1);
    }
  };

  if (!movie) return <div style={{ padding: 20 }}>Cargando…</div>;

  const episodes = movie.episodios || null;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{movie.titulo}</h1>

      {episodes ? (
        <video
          key={episodes[current].url}
          controls
          autoPlay
          onEnded={handleEnded}
          style={{ width: "100%", borderRadius: "10px" }}
        >
          <source src={episodes[current].url} type="video/mp4" />
        </video>
      ) : (
        <video controls style={{ width: "100%", borderRadius: "10px" }}>
          <source src={movie.video} type="video/mp4" />
        </video>
      )}

      {episodes && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
          {episodes.map((ep, index) => (
            <li
              key={index}
              onClick={() => setCurrent(index)}
              style={{
                padding: "10px",
                cursor: "pointer",
                background: index === current ? "#0af" : "#222",
                color: "white",
                borderRadius: "5px",
                marginBottom: "8px"
              }}
            >
              Episodio {ep.titulo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
