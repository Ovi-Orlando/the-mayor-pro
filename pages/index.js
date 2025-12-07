import { useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [sel, setSel] = useState(null);
  const [currentEp, setCurrentEp] = useState(0);

  // Cargar películas desde el gist
  useEffect(() => {
    fetch("/api/gist")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setMovies(
            d.filter((m) => m && typeof m === "object" && m.titulo)
          );
        } else {
          setMovies([]);
        }
      })
      .catch(() => setMovies([]));
  }, []);

  // Acceso oculto admin (Shift + A)
  useEffect(() => {
    function secret(e) {
      if (e.shiftKey && e.key.toLowerCase() === "a") {
        const pass = prompt("Introduce tu contraseña:");
        if (pass === "admin_ovi") {
          window.location.href = "/admin";
        } else if (pass !== null) {
          alert("Contraseña incorrecta.");
        }
      }
    }
    window.addEventListener("keydown", secret);
    return () => window.removeEventListener("keydown", secret);
  }, []);

  // Cuando seleccionas una serie → cargar último capítulo visto
  useEffect(() => {
    if (sel && sel.tipo === "Serie") {
      const last = localStorage.getItem("last_ep_" + sel.id);
      setCurrentEp(last ? Number(last) : 0);
    }
  }, [sel]);

  function playEpisode(i) {
    setCurrentEp(i);
    if (sel) {
      localStorage.setItem("last_ep_" + sel.id, i);
    }
  }

  function getVideoURL() {
    if (!sel) return "";

    if (sel.tipo === "Serie") {
      if (!sel.episodios || sel.episodios.length === 0) return "";
      return sel.episodios[currentEp]?.url || "";
    }

    return sel.video || "";
  }

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <header
        style={{
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <img src="/logo.png" style={{ height: 48 }} />
        <h1 style={{ margin: 0 }}>The Mayor</h1>
      </header>

      <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>
        <h2>Catálogo</h2>

        {movies.length === 0 ? (
          <p>No hay películas o series.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 16,
            }}
          >
            {movies.map((m) => (
              <div
                key={m.id || m.titulo}
                style={{ background: "#0b1220", borderRadius: 8 }}
              >
                <img
                  src={(m.imagen || "/placeholder.png").trim()}
                  style={{
                    width: "100%",
                    height: 260,
                    objectFit: "contain",
                    background: "#000",
                  }}
                />

                <div style={{ padding: 10 }}>
                  <strong>{m.titulo}</strong>

                  <div style={{ color: "#9ca3af" }}>
                    {m.tipo} • {m.genero} • {m.anio}
                  </div>

                  <p>{m.descripcion}</p>

                  <button
                    onClick={() => setSel(m)}
                    style={{
                      background: "#e50914",
                      color: "#fff",
                      border: 0,
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* REPRODUCTOR */}
      {sel && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setSel(null)}
        >
          <div
            style={{ width: "90%", maxWidth: 1000 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{sel.titulo}</h2>

            <div style={{ display: "flex", gap: 20 }}>
              {/* VIDEO */}
              <div style={{ flex: 3 }}>
                <div style={{ aspectRatio: "16/9", background: "#000" }}>
                  <video
                    controls
                    autoPlay
                    style={{ width: "100%", height: "100%" }}
                  >
                    <source src={getVideoURL()} type="video/mp4" />
                  </video>
                </div>
              </div>

              {/* LISTA DE EPISODIOS */}
              {sel.tipo === "Serie" && (
                <div
                  style={{
                    flex: 1,
                    background: "#111",
                    padding: 12,
                    borderRadius: 8,
                    maxHeight: "60vh",
                    overflowY: "auto",
                  }}
                >
                  <h3>Episodios</h3>

                  {sel.episodios.map((ep, i) => (
                    <div
                      key={i}
                      onClick={() => playEpisode(i)}
                      style={{
                        padding: 10,
                        marginBottom: 6,
                        background: i === currentEp ? "#e50914" : "#222",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      <strong>{ep.titulo || `Episodio ${i + 1}`}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p>{sel.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
