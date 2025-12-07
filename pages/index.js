import { useEffect, useState } from 'react';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [sel, setSel] = useState(null);
  const [currentVideo, setCurrentVideo] = useState("");

  // Cargar películas desde el gist
  useEffect(() => {
    fetch('/api/gist')
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

  // ACCESO OCULTO ADMIN: SHIFT + A
  useEffect(() => {
    function secret(e) {
      if (e.shiftKey && e.key.toLowerCase() === "a") {
        const pass = prompt("Introduce tu contraseña:");
        if (pass === "admin_ovi") {
          window.location.href = "/admin?key=admin_ovi";
        } else if (pass !== null) {
          alert("Contraseña incorrecta.");
        }
      }
    }

    window.addEventListener("keydown", secret);
    return () => window.removeEventListener("keydown", secret);
  }, []);

  // Cuando opens un item, decidir qué video reproducir
  function openItem(item) {
    setSel(item);

    if (Array.isArray(item.capitulos) && item.capitulos.length > 0) {
      // SERIES → reproducir primer capítulo
      setCurrentVideo(item.capitulos[0].url.trim());
    } else {
      // PELÍCULA → usar url normal
      setCurrentVideo((item.video || "").trim());
    }
  }

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <header
        style={{
          padding: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" style={{ height: 48 }} alt="logo" />
          <h1 style={{ margin: 0 }}>The Mayor</h1>
        </div>
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
                  alt={m.titulo || "imagen"}
                />
                <div style={{ padding: 10 }}>
                  <strong>{m.titulo}</strong>

                  <div style={{ color: "#9ca3af" }}>
                    {m.tipo || "Película"} • {m.genero || "Sin género"} •{" "}
                    {m.anio || "S/A"}
                  </div>

                  <p>{m.descripcion || "Sin descripción"}</p>

                  <button
                    onClick={() => openItem(m)}
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

      {sel && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            padding: 20
          }}
          onClick={() => {
            setSel(null);
            setCurrentVideo("");
          }}
        >
          <div
            style={{ width: "90%", maxWidth: 1000 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0 }}>{sel.titulo}</h3>

            {/* Reproductor */}
            <div style={{ aspectRatio: "16/9", marginTop: 10 }}>
              <video controls autoPlay style={{ width: "100%", height: "100%" }}>
                <source src={currentVideo} type="video/mp4" />
                Tu navegador no soporta video.
              </video>
            </div>

            {/* Lista de capítulos si aplica */}
            {Array.isArray(sel.capitulos) && sel.capitulos.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h4>Capítulos</h4>
                <ul>
                  {sel.capitulos.map((c, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>
                      <button
                        onClick={() => setCurrentVideo(c.url.trim())}
                        style={{
                          background: "#1f2937",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: 6,
                          border: 0,
                          cursor: "pointer"
                        }}
                      >
                        {c.nombre || `Capítulo ${i + 1}`}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p style={{ color: "#d1d5db" }}>{sel.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
