import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);

  // 🔐 Verificar acceso (solo sesión)
  useEffect(() => {
    if (sessionStorage.getItem("admin_ok") === "true") {
      setAuthorized(true);
    } else {
      // Si NO está autorizado → regresar al inicio
      window.location.href = "/";
    }
  }, []);

  if (!authorized) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Verificando acceso...</p>
      </div>
    );
  }

  return <AdminRealPanel />;
}

/* ============================
     PANEL ADMIN REAL
   ============================ */

function AdminRealPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gist")
      .then((r) => r.json())
      .then((d) => {
        setItems(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: 20 }}>
      <h2>Panel de administración</h2>
      {loading ? <p>Cargando…</p> : <p>{items.length} elementos cargados</p>}
    </div>
  );
}
