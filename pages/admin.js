import { useState } from "react";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key === "admin_ovi") {
      setAuthorized(true);
      setError("");
    } else {
      setError("Clave incorrecta");
    }
  };

  if (!authorized) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#0b0b0b",
          color: "white",
          flexDirection: "column",
        }}
      >
        <h2 className="text-2xl mb-4">Acceso restringido</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <input
            type="password"
            placeholder="Introduce tu clave"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #444",
              background: "#1b1b1b",
              color: "white",
              outline: "none",
              width: "250px",
              textAlign: "center",
            }}
          />
          <button
            type="submit"
            style={{
              marginTop: "15px",
              background: "#e50914",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </form>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    );
  }

  // 👇 Panel administrativo una vez validado
  return (
    <div style={{ padding: "20px", background: "#0b0b0b", color: "white", minHeight: "100vh" }}>
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
      <p>Bienvenido, Admin 👑</p>
      {/* Aquí sigue tu código del panel original */}
    </div>
  );
}
