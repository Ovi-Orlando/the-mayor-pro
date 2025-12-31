import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  // Mantener sesión iniciada
  useEffect(() => {
    if (sessionStorage.getItem("admin_ok") === "yes") {
      setAuthorized(true);
    }
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

  // LOGIN
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
          <h2>Acceso Admin</h2>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Contraseña"
              style={{
                width: "100%",
                padding: 10,
                marginTop: 10,
                borderRadius: 8,
                border: "1px solid #333",
                background: "#222",
                color: "#fff",
              }}
            />

            {error && (
              <p style={{ color: "#ff6b6b", marginTop: 8 }}>{error}</p>
            )}

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
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}

/* =========================
   PANEL ADMIN REAL
========================= */

function AdminPanel() {
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

  async function saveAll(data) {
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movies: data }),
    });

    if (res.ok) {
      alert("Guardado correctamente");
      setItems(data);
    } else {
      alert("Error al guardar");
    }
  }

  function add() {
    setItems([
      {
        id: Date.now(),
        titulo: "Nuevo",
        tipo: "Película",
        genero: "",
        anio: new Date().getFullYear(),
        descripcion: "",
        imagen: "",
        video: "",
        episodios: [],
      },
      ...items,
    ]);
  }

  function update(i, field, value) {
    const copy = [...items];
    copy[i] = { ...copy[i], [field]: value };
    setItems(copy);
  }

  function remove(i) {
    if (!confirm("¿Eliminar este elemento?")) return;
    const filtered = items.filter((_, idx) => idx !== i);
    saveAll(filtered);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2>Panel de administración</h2>

        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <button
            onClick={add}
            style={{ background: "#e50914", color: "#fff", padding: 8, border: 0 }}
          >
            + Agregar
          </button>

          <button
            onClick={() => saveAll(items)}
            style={{ background: "#06b6d4", color: "#000", padding: 8, border: 0 }}
          >
            Guardar
          </button>
        </div>

        {loading ? (
          <p>Cargando…</p>
        ) : (
          items.map((it, idx) => (
            <div
              key={it.id}
              style={{
                background: "#071018",
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <input
                value={it.titulo}
                onChange={(e) => update(idx, "titulo", e.target.value)}
                placeholder="Título"
                style={{ width: "100%", marginBottom: 6 }}
              />

              <select
                value={it.tipo}
                onChange={(e) => update(idx, "tipo", e.target.value)}
                style={{ width: "100%", marginBottom: 6 }}
              >
                <option>Película</option>
                <option>Serie</option>
              </select>

              <input
                value={it.video || ""}
                onChange={(e) => update(idx, "video", e.target.value)}
                placeholder="URL video (solo películas)"
                style={{ width: "100%", marginBottom: 6 }}
              />

              <button
                onClick={() => remove(idx)}
                style={{ background: "#b91c1c", color: "#fff", border: 0, padding: 6 }}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
