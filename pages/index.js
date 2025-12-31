import { useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [sel, setSel] = useState(null);
  const [currentEp, setCurrentEp] = useState(0);

  // Cargar películas y series desde el gist
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

  // 🔐 ACCESO SECRETO ADMIN (SHIFT + A) — UNA SOLA VEZ
  useEffect(() => {
    function secret(e) {
      if (e.shiftKey && e.key.toLowerCase() === "a") {
        const ok = sessionStorage.getItem("admin_ok");

        if (ok === "true") {
          window.location.href = "/admin";
          return;
        }

        const pass = prompt("Acceso admin:");
        if (pass === "admin_ovi") {
          sessionStorage.setItem("admin_ok", "true");
          window.location.href = "/admin";
        } else if (pass !== null) {
          alert("Contraseña incorrecta.");
        }
      }
    }

    window.addEventListener("keydown", secret);
    return () => window.removeEventListener("keydown", secret);
  }, []);

  // Cargar último episodio visto
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
      return sel.episodios?.[currentEp]?.url || "";
    }

    return sel.video || "";
  }

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <header style={{ padding: 16, display: "flex", gap: 12 }}>
        <img src="/logo.png" style={{ height: 48 }} />
        <h1 style={{ margin: 0 }}>The Mayor</h1>
      </header>

      <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>
        <h2>Catálogo</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 16,
          }}
        >
          {movies.map((m) => (
            <div key={m.id || m.titulo} style={{ background: "#0b1220", borderRadius: 8 }}>
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
                    cursor: "pointer",
                  }}
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>
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
          }}
          onClick={() => setSel(null)}
        >
          <div style={{ width: "90%", maxWidth: 1000 }} onClick={(e) => e.stopPropagation()}>
            <h2>{sel.titulo}</h2>

            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ flex: 3 }}>
                <video controls autoPlay style={{ width: "100%" }}>
                  <source src={getVideoURL()} type="video/mp4" />
                </video>
              </div>

              {sel.tipo === "Serie" && (
                <div style={{ flex: 1, background: "#111", padding: 12 }}>
                  <h3>Episodios</h3>
                  {sel.episodios.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => playEpisode(i)}
                      style={{
                        padding: 8,
                        background: i === currentEp ? "#e50914" : "#222",
                        marginBottom: 6,
                        cursor: "pointer",
                      }}
                    >
                      Episodio {i + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
