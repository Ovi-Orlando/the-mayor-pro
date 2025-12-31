import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  // Si ya inició sesión antes
  useEffect(() => {
    if (sessionStorage.getItem("admin_ok") === "yes") {
      setAuthorized(true);
    }
  }, []);

  // Login manejado sin redirecciones externas
  function handleLogin(e) {
    e.preventDefault();

    if (pass === "admin_ovi") {
      sessionStorage.setItem("admin_ok", "yes");
      setAuthorized(true);
    } else {
      setError("Clave incorrecta");
    }
  }

  // Si NO está autorizado → Mostrar pantalla de login
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
        </div>
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

  // Carga inicial desde tu api/gist
  useEffect(() => {
    fetch("/api/gist")
      .then((r) => r.json())
      .then((d) => {
        const arr = Array.isArray(d) ? d : [];
        setItems(arr);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function saveAll(newItems) {
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movies: newItems }),
      });

      if (!res.ok) {
        alert("Error al guardar");
        return;
      }

      alert("Guardado correctamente");
      setItems(newItems);
    } catch {
      alert("Error de red");
    }
  }

  function add() {
    setItems([
      {
        id: Date.now(),
        titulo: "Nuevo",
        tipo: "Película",
        genero: "",
        anio: "",
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
    copy[i][field] = value;
    setItems(copy);
  }

  function addEpisode(i) {
    const copy = [...items];
    copy[i].episodios.push({ titulo: "", url: "" });
    setItems(copy);
  }

  function updateEpisode(i, e, field, value) {
    const copy = [...items];
    copy[i].episodios[e][field] = value;
    setItems(copy);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 20 }}>
      <h2>Panel de administración</h2>

      <button onClick={add}>Agregar</button>
      <button onClick={() => saveAll(items)}>Guardar</button>

      {loading ? (
        <p>Cargando…</p>
      ) : (
        items.map((it, i) => (
          <div key={it.id} style={{ marginTop: 20 }}>
            <input value={it.titulo} onChange={(e) => update(i, "titulo", e.target.value)} />
            <select value={it.tipo} onChange={(e) => update(i, "tipo", e.target.value)}>
              <option>Película</option>
              <option>Serie</option>
            </select>

            {it.tipo === "Serie" &&
              it.episodios.map((ep, e) => (
                <div key={e}>
                  <input
                    value={ep.titulo}
                    onChange={(ev) => updateEpisode(i, e, "titulo", ev.target.value)}
                  />
                  <input
                    value={ep.url}
                    onChange={(ev) => updateEpisode(i, e, "url", ev.target.value)}
                  />
                </div>
              ))}

            {it.tipo === "Serie" && <button onClick={() => addEpisode(i)}>+ Episodio</button>}
          </div>
        ))
      )}
    </div>
  );
}
