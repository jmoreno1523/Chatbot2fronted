import React, { useState } from 'react';
import Login from './Login';
import Chat from './Chat';

function App() {
  const [usuario, setUsuario] = useState(null);

  const handleLogin = (datos) => {
    setUsuario(datos);
  };

  return (
    <div>
      {usuario ? (
        <div>
          <h1>Bienvenido, {usuario.nombre}!</h1>
          <p>ID: {usuario.id}</p>
          <p>Correo: {usuario.correo}</p>
          <Chat usuario={usuario} />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

