import { useState, useEffect } from "react";

export default function Home() {
  const [peliculas, setPeliculas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    fetch("https://gist.githubusercontent.com/Ovi-Orlando/58715e8bdc303394122d0fbf4605faf9/raw/fa7f6f4373f09daaf4a937ac3d74a82df8675e20/gistfile1.txt")
      .then((res) => res.json())
      .then((data) => setPeliculas(data))
      .catch((err) => console.error("Error cargando catálogo:", err));
  }, []);

  if (seleccionada) {
    return (
      <div className="player-container">
        <button className="volver" onClick={() => setSeleccionada(null)}>← Volver</button>
        <video
          controls
          autoPlay
          className="video-player"
          src={seleccionada.video}
        />
        <h2>{seleccionada.titulo}</h2>
        <p>{seleccionada.descripcion}</p>
      </div>
    );
  }

  return (
    <div className="catalogo">
      <h1 className="titulo">🎥 Catálogo de Películas</h1>
      <div className="grid">
        {peliculas.map((peli) => (
          <div key={peli.id} className="card" onClick={() => setSeleccionada(peli)}>
            <img src={peli.imagen} alt={peli.titulo} />
            <div className="info">
              <h3>{peli.titulo}</h3>
              <p>{peli.genero} • {peli.anio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
