import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);

  // Verificación silenciosa
  useEffect(() => {
    const ok = sessionStorage.getItem("admin_ok");
    if (ok === "true") {
      setAuthorized(true);
    } else {
      // Si intentan entrar directo
      window.location.href = "/";
    }
  }, []);

  if (!authorized) return null;

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

  async function saveAll(newItems) {
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
    if (!confirm("¿Eliminar?")) return;
    const filtered = items.filter((_, idx) => idx !== i);
    saveAll(filtered);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 20 }}>
      <h2>Panel Admin</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={add}>+ Agregar</button>
        <button onClick={() => saveAll(items)} style={{ marginLeft: 10 }}>
          Guardar
        </button>
      </div>

      {loading ? (
        <p>Cargando…</p>
      ) : (
        items.map((it, i) => (
          <div key={it.id} style={{ marginBottom: 12, background: "#111", padding: 12 }}>
            <input
              value={it.titulo}
              onChange={(e) => update(i, "titulo", e.target.value)}
              placeholder="Título"
            />
            <button onClick={() => remove(i)}>Eliminar</button>
          </div>
        ))
      )}
    </div>
  );
}
