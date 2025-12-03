import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

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

  if (!authorized) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "#111",
          padding: 24,
          borderRadius: 10,
          width: 320
        }}>
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
                color: "#fff"
              }}
            />

            {error && (
              <p style={{ color: "#ff6b6b" }}>{error}</p>
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
                cursor: "pointer"
              }}>
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

  useEffect(() => {
    fetch("/api/gist")
      .then(r => r.json())
      .then(d => {
        setItems(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function saveAll(newItems) {
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movies: newItems })
    });

    if (!res.ok) return alert("Error al guardar");
    alert("Guardado correctamente");
    setItems(newItems);
  }

  function add() {
    setItems([
      {
        id: Date.now(),
        titulo: "Nuevo",
        tipo: "Película",
        genero: "Sin categoría",
        anio: new Date().getFullYear(),
        descripcion: "",
        imagen: "",
        video: "",
        episodios: []  // ← soporte para series
      },
      ...items,
    ]);
  }

  function update(i, field, value) {
    const copy = [...items];
    copy[i][field] = value;
    setItems(copy);
  }

  async function remove(i) {
    if (!confirm("¿Eliminar este elemento?")) return;
    const filtered = items.filter((_, idx) => idx !== i);
    await saveAll(filtered);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2>Panel de administración</h2>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={add} style={{ background: "#e50914", color: "#fff", padding: 8 }}>
            + Agregar
          </button>
          <button onClick={() => saveAll(items)} style={{ background: "#06b6d4", color: "#fff", padding: 8 }}>
            Guardar
          </button>
        </div>

        {loading ? (
          <p>Cargando…</p>
        ) : (
          items.map((it, idx) => (
            <div key={it.id} style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr 120px",
              gap: 12,
              background: "#071018",
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
            }}>

              <img
                src={it.imagen || "/logo.png"}
                alt=""
                style={{ width: 180, height: 110, objectFit: "contain", background: "#111", borderRadius: 8 }}
              />

              <div>
                <input value={it.titulo} onChange={(e) => update(idx, "titulo", e.target.value)} placeholder="Título" style={{ width: "100%", marginBottom: 8 }} />

                {/* Tipo Película/Serie */}
                <select
                  value={it.tipo || "Película"}
                  onChange={(e) => update(idx, "tipo", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 8,
                    background: "#111",
                    color: "#fff",
                    borderRadius: 6,
                    border: "1px solid #333"
                  }}
                >
                  <option value="Película">Película</option>
                  <option value="Serie">Serie</option>
                </select>

                <div style={{ display: "flex", gap: 8 }}>
                  <input value={it.genero} onChange={(e) => update(idx, "genero", e.target.value)} placeholder="Género" style={{ width: "50%" }} />
                  <input value={it.anio} onChange={(e) => update(idx, "anio", e.target.value)} placeholder="Año" style={{ width: "50%" }} />
                </div>

                <input value={it.descripcion} onChange={(e) => update(idx, "descripcion", e.target.value)} placeholder="Descripción" style={{ marginTop: 8 }} />
                <input value={it.imagen} onChange={(e) => update(idx, "imagen", e.target.value)} placeholder="URL imagen" style={{ marginTop: 8 }} />
                <input value={it.video} onChange={(e) => update(idx, "video", e.target.value)} placeholder="URL video" style={{ marginTop: 8 }} />

                {/* ================================
                      EPISODIOS (solo en serie)
                ================================= */}
                {it.tipo === "Serie" && (
                  <div style={{
                    marginTop: 12,
                    padding: 12,
                    background: "#0b1620",
                    borderRadius: 6
                  }}>
                    <h4 style={{ marginBottom: 6 }}>Episodios</h4>

                    {(it.episodios || []).map((ep, eidx) => (
                      <div key={eidx} style={{
                        display: "flex",
                        gap: 6,
                        marginBottom: 6
                      }}>
                        <input
                          value={ep.titulo}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[idx].episodios[eidx].titulo = e.target.value;
                            setItems(copy);
                          }}
                          placeholder="Título episodio"
                          style={{ flex: 1 }}
                        />

                        <input
                          value={ep.url}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[idx].episodios[eidx].url = e.target.value;
                            setItems(copy);
                          }}
                          placeholder="URL episodio"
                          style={{ flex: 2 }}
                        />

                        <button
                          onClick={() => {
                            const copy = [...items];
                            copy[idx].episodios.splice(eidx, 1);
                            setItems(copy);
                          }}
                          style={{
                            background: "#b91c1c",
                            color: "#fff",
                            padding: "6px 10px",
                            borderRadius: 4
                          }}
                        >
                          X
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const copy = [...items];
                        if (!copy[idx].episodios) copy[idx].episodios = [];
                        copy[idx].episodios.push({ titulo: "", url: "" });
                        setItems(copy);
                      }}
                      style={{
                        background: "#1d4ed8",
                        color: "#fff",
                        padding: "6px 10px",
                        borderRadius: 4,
                        marginTop: 6
                      }}
                    >
                      + Agregar episodio
                    </button>
                  </div>
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                <button onClick={() => remove(idx)} style={{ background: "#b91c1c", color: "#fff", padding: 8, borderRadius: 4 }}>
                  Eliminar
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
