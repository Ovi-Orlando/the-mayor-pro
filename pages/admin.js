import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const { key } = router.query;
    if (key === 'admin_ovi') {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, [router.query]);

  if (!authorized) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>404 | Página no encontrada</h2>
      </div>
    );
  }

  // 👇 aquí va tu interfaz del panel admin existente
  return (
    <div>
      <h1>Panel de Administración</h1>
      {/* Tu contenido admin existente */}
    </div>
  );
}

