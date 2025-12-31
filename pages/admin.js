import { useEffect, useState } from "react";

export default function Admin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gist")
      .then(r => r.json())
      .then(d => {
        // 🔧 COMPATIBLE CON AMBOS FORMATOS
        const arr = Array.isArray(d)
          ? d
          : Array.isArray(d.movies)
          ? d.movies
          : [];

        setItems(arr);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const saveAll = async () => {
    await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items)
    });
    alert("Guardado");
  };

  const updateItem = (i, key, value) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: value };
    setItems(copy);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        titulo: "",
        tipo: "Película",
        poster: "",
        video: "",
        descripcion: "",
        episodios: []
      }
    ]);
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin</h1>

      <button onClick={addItem}>➕ Agregar</button>
      <button onClick={saveAll} style={{ marginLeft: 10 }}>
        💾 Guardar todo
      </button>

      {items.map((item, i) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginTop: 10
          }}
        >
          <input
            placeholder="Título"
            value={item.titulo || ""}
            onChange={e => updateItem(i, "titulo", e.target.value)}
          />

          <select
            value={item.tipo || "Película"}
            onChange={e => updateItem(i, "tipo", e.target.value)}
          >
            <option>Película</option>
            <option>Serie</option>
          </select>

          <input
            placeholder="Poster"
            value={item.poster || ""}
            onChange={e => updateItem(i, "poster", e.target.value)}
          />

          <input
            placeholder="Video"
            value={item.video || ""}
            onChange={e => updateItem(i, "video", e.target.value)}
          />

          <textarea
            placeholder="Descripción"
            value={item.descripcion || ""}
            onChange={e => updateItem(i, "descripcion", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
