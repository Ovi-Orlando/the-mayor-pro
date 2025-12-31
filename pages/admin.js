import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  // Sesión persistente
  useEffect(() => {
    if (sessionStorage.getItem("admin_ok") === "yes") {
      setAuthorized(true);
    }

    // Acceso con Shift + A
    function handleKey(e) {
      if (e.shiftKey && e.key.toLowerCase() === "a") {
        sessionStorage.setItem("admin_ok", "yes");
        setAuthorized(true);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleLogin(e) {
    e.preventDefault();

    if (pass === "admin_ovi") {
      sessionStorage.setItem("admin_ok", "yes");
      setAuthorized(true);
    } else {
      setError("Clave incorrecta");
    }
  }

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
        <div
          style={{
            background: "#111",
            padding: 24,
            borderRadius: 10,
            width: 340,
          }}
        >
          <h2 style={{ marginBottom: 16 }}>Acceso Admin</h2>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Contraseña"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #333",
                background: "#222",
                color: "#fff",
              }}
            />

            {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: 12,
                background: "#06b6d4",
                color: "#000",
                padding: 10,
                borderRadius: 8,
                border: 0,
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Entrar
            </button>
          </form>

          <p style={{ marginTop: 10, fontSize: 12, color: "#9ca3af" }}>
            Tip: también puedes entrar con <b>Shift + A</b>
          </p>
        </div>
      </div>
    );
  }

  return <AdminRealPanel />;
}

/* ============================
   PANEL ADMIN REAL (TUYO)
   ============================ */

function AdminRealPanel() {
  // ⚠️ TODO TU CÓDIGO DE AQUÍ PARA ABAJO
  // ⚠️ SE MANTIENE EXACTAMENTE IGUAL
  // ⚠️ NO SE TOCA NADA
