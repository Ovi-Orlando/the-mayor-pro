import { useEffect, useState } from "react";

export default function Home() {
  const [peliculas, setPeliculas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    fetch("/catalogo.json")
      .then((res) => res.json())
      .then((data) => setPeliculas(data))
      .catch((err) => console.error("Error al cargar el catálogo:", err));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        padding: "2rem",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2rem" }}>
        🎬 The Mayor
      </h1>

      {/* Catálogo de películas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.5rem",
          justifyItems: "center",
        }}
      >
        {peliculas.map((p) => (
          <div
            key={p.id}
            style={{
              backgroundColor: "#111",
              borderRadius: "12px",
              overflow: "hidden",
              width: "220px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onClick={() => setSeleccionada(p)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={p.imagen}
              alt={p.titulo}
              style={{
                width: "100%",
                height: "330px",
                objectFit: "cover",
              }}
            />
            <div style={{ padding: "0.8rem" }}>
              <h3 style={{ margin: "0.3rem 0", fontSize: "1rem", fontWeight: "600" }}>
                {p.titulo}
              </h3>
              <p style={{ margin: "0", fontSize: "0.9rem", color: "#aaa" }}>
                {p.genero} • {p.anio}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de reproducción */}
      {seleccionada && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
          onClick={() => setSeleccionada(null)}
        >
          <div
            style={{
              position: "relative",
              width: "80%",
              maxWidth: "900px",
              backgroundColor: "#111",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 0 25px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              controls
              autoPlay
              style={{ width: "100%", height: "auto", borderRadius: "12px" }}
            >
              <source src={seleccionada.video} type="video/mp4" />
              Tu navegador no soporta la reproducción de video.
            </video>
            <div style={{ padding: "1rem" }}>
              <h2 style={{ margin: "0.5rem 0" }}>{seleccionada.titulo}</h2>
              <p style={{ color: "#ccc" }}>{seleccionada.descripcion}</p>
              <button
                onClick={() => setSeleccionada(null)}
                style={{
                  marginTop: "1rem",
                  background: "#e50914",
                  border: "none",
                  color: "#fff",
                  padding: "0.6rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
