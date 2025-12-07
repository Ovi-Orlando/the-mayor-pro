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
        // Asegurarnos que cada item tenga estructura esperada
        const arr = Array.isArray(d) ? d : [];
        const normalized = arr.map((it) => {
          return {
            id: it.id ?? Date.now(),
            titulo: it.titulo ?? it.title ?? "Sin título",
            tipo: it.tipo ?? "Película",
            genero: it.genero ?? it.genre ?? "Sin categoría",
            anio: it.anio ?? it.year ?? new Date().getFullYear(),
            descripcion: it.descripcion ?? it.description ?? "",
            imagen: it.imagen ?? it.image ?? it.poster ?? "",
            video: it.video ?? it.vídeo ?? "",
            episodios: Array.isArray(it.episodios) ? it.episodios : [],
            // preservar otras propiedades si las hay
            ...it,
          };
        });
        setItems(normalized);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Guardar todos (llama a tu /api/save)
  async function saveAll(newItems) {
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movies: newItems }),
      });

      if (!res.ok) {
        alert("Error al guardar");
        return false;
      }

      alert("Guardado correctamente");
      setItems(newItems);
      return true;
    } catch (err) {
      console.error(err);
      alert("Error al guardar (network)");
      return false;
    }
  }

  // Agregar nuevo item (película por defecto)
  function add() {
    const nuevo = {
      id: Date.now(),
      titulo: "Nuevo",
      tipo: "Película",
      genero: "Sin categoría",
      anio: new Date().getFullYear(),
      descripcion: "",
      imagen: "",
      video: "",
      episodios: [],
    };
    setItems([nuevo, ...items]);
  }

  // Actualizar campo simple
  function update(i, field, value) {
    const copy = [...items];
    copy[i] = { ...copy[i], [field]: value };

    // Si cambiamos tipo a "Serie" y no existe episodios, crearlo
    if (field === "tipo" && value === "Serie" && !Array.isArray(copy[i].episodios)) {
      copy[i].episodios = [];
    }

    setItems(copy);
  }

  // Eliminar elemento
  async function remove(i) {
    if (!confirm("¿Eliminar este elemento?")) return;
    const filtered = items.filter((_, idx) => idx !== i);
    const ok = await saveAll(filtered);
    if (ok) setItems(filtered);
  }

  // Agregar episodio (usa índice del item)
  function addEpisode(itemIndex) {
    const copy = [...items];
    if (!Array.isArray(copy[itemIndex].episodios)) copy[itemIndex].episodios = [];
    copy[itemIndex].episodios.push({ titulo: "", url: "" });
    setItems(copy);
  }

  // Actualizar episodio (titulo o url)
  function updateEpisode(itemIndex, epIndex, field, value) {
    const copy = [...items];
    if (!Array.isArray(copy[itemIndex].episodios)) copy[itemIndex].episodios = [];
    copy[itemIndex].episodios[epIndex] = {
      ...copy[itemIndex].episodios[epIndex],
      [field]: value,
    };
    setItems(copy);
  }

  // Eliminar episodio
  function removeEpisode(itemIndex, epIndex) {
    const copy = [...items];
    if (!Array.isArray(copy[itemIndex].episodios)) return;
    copy[itemIndex].episodios.splice(epIndex, 1);
    setItems(copy);
  }

  // Reordenar episodios (subir)
  function moveEpisodeUp(itemIndex, epIndex) {
    if (epIndex === 0) return;
    const copy = [...items];
    const eps = copy[itemIndex].episodios;
    [eps[epIndex - 1], eps[epIndex]] = [eps[epIndex], eps[epIndex - 1]];
    setItems(copy);
  }

  // Reordenar episodios (bajar)
  function moveEpisodeDown(itemIndex, epIndex) {
    const copy = [...items];
    const eps = copy[itemIndex].episodios;
    if (epIndex === eps.length - 1) return;
    [eps[epIndex + 1], eps[epIndex]] = [eps[epIndex], eps[epIndex + 1]];
    setItems(copy);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2>Panel de administración</h2>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={add} style={{ background: "#e50914", color: "#fff", padding: 8, border: 0, borderRadius: 6 }}>
            + Agregar
          </button>

          <button
            onClick={() => saveAll(items)}
            style={{ background: "#06b6d4", color: "#fff", padding: 8, border: 0, borderRadius: 6 }}
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
                display: "grid",
                gridTemplateColumns: "180px 1fr 120px",
                gap: 12,
                background: "#071018",
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              {/* Poster */}
              <img
                src={it.imagen || "/logo.png"}
                alt=""
                style={{ width: 180, height: 110, objectFit: "contain", background: "#111", borderRadius: 8 }}
              />

              {/* Campos editables */}
              <div>
                {/* Título */}
                <input
                  value={it.titulo}
                  onChange={(e) => update(idx, "titulo", e.target.value)}
                  placeholder="Título"
                  style={{ width: "100%", marginBottom: 8, padding: 8, borderRadius: 6, border: "1px solid #222", background: "#0b1220", color: "#fff" }}
                />

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
                    border: "1px solid #333",
                  }}
                >
                  <option value="Película">Película</option>
                  <option value="Serie">Serie</option>
                </select>

                {/* Género + Año */}
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={it.genero}
                    onChange={(e) => update(idx, "genero", e.target.value)}
                    placeholder="Género"
                    style={{ width: "50%", padding: 8, borderRadius: 6, border: "1px solid #222", background: "#0b1220", color: "#fff" }}
                  />
                  <input
                    value={it.anio}
                    onChange={(e) => update(idx, "anio", e.target.value)}
                    placeholder="Año"
                    style={{ width: "50%", padding: 8, borderRadius: 6, border: "1px solid #222", background: "#0b1220", color: "#fff" }}
                  />
                </div>

                {/* Descripción, imagen y video principal */}
                <input
                  value={it.descripcion}
                  onChange={(e) => update(idx, "descripcion", e.target.value)}
                  placeholder="Descripción"
                  style={{ marginTop: 8, width: "100%", padding: 8, borderRadius: 6, border: "1px solid #222", background: "#0b1220", color: "#fff" }}
                />
                <input
                  value={it.imagen}
                  onChange={(e) => update(idx, "imagen", e.target.value)}
                  placeholder="URL imagen"
                  style={{ marginTop: 8, width: "100%", padding: 8, borderRadius: 6, border: "1px solid #222", background: "#0b1220", color: "#fff" }}
                />
                <input
                  value={it.video}
                  onChange={(e) => update(idx, "video", e.target.value)}
                  placeholder="URL video (uso si NO es serie)"
                  style={{ marginTop: 8, width: "100%", padding: 8, borderRadius: 6, border: "1px solid #222", background: "#0b1220", color: "#fff" }}
                />

                {/* ================================
                      EPISODIOS (solo en series)
                ================================= */}
                {it.tipo === "Serie" && (
                  <div style={{ marginTop: 12, padding: 12, background: "#0b1620", borderRadius: 6 }}>
                    <h4 style={{ marginBottom: 10 }}>Episodios</h4>

                    {/* Lista de episodios */}
                    {(it.episodios || []).map((ep, eidx) => (
                      <div key={eidx} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                        <input
                          value={ep.titulo || ep.name || ""}
                          onChange={(e) => updateEpisode(idx, eidx, "titulo", e.target.value)}
                          placeholder="Título episodio"
                          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #222", background: "#071218", color: "#fff" }}
                        />

                        <input
                          value={ep.url || ep.src || ""}
                          onChange={(e) => updateEpisode(idx, eidx, "url", e.target.value)}
                          placeholder="URL episodio"
                          style={{ flex: 2, padding: 8, borderRadius: 6, border: "1px solid #222", background: "#071218", color: "#fff" }}
                        />

                        {/* Controles episodio (mover, eliminar) */}
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            title="Subir"
                            onClick={() => moveEpisodeUp(idx, eidx)}
                            style={{ background: "#374151", color: "#fff", padding: "6px 8px", borderRadius: 6, border: 0 }}
                          >
                            ↑
                          </button>

                          <button
                            title="Bajar"
                            onClick={() => moveEpisodeDown(idx, eidx)}
                            style={{ background: "#374151", color: "#fff", padding: "6px 8px", borderRadius: 6, border: 0 }}
                          >
                            ↓
                          </button>

                          <button
                            title="Eliminar episodio"
                            onClick={() => removeEpisode(idx, eidx)}
                            style={{ background: "#b91c1c", color: "#fff", padding: "6px 10px", borderRadius: 6, border: 0 }}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ))}

                    <div style={{ marginTop: 6 }}>
                      <button
                        onClick={() => addEpisode(idx)}
                        style={{ background: "#1d4ed8", color: "#fff", padding: "8px 12px", borderRadius: 6, border: 0 }}
                      >
                        + Agregar episodio
                      </button>
                    </div>

                    <p style={{ marginTop: 10, color: "#9ca3af", fontSize: 13 }}>
                      Consejo: añade los episodios en orden (1x1, 1x2, ...) y usa URLs directas a los MP4.
                    </p>
                  </div>
                )}
              </div>

              {/* Botón eliminar */}
              <div style={{ textAlign: "right" }}>
                <button
                  onClick={() => remove(idx)}
                  style={{ background: "#b91c1c", color: "#fff", padding: 8, borderRadius: 6, border: 0 }}
                >
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
