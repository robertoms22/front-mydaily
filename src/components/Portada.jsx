import React from 'react';

function Portada() {
  return (
    <div className="portada">
      <video className="video-background" src="/assets/portada.mp4" autoPlay loop muted playsInline></video>
      <div className="portada-content">
        <h1>Bienvenido a Mi Día de Trabajo</h1>
        <p>Tu herramienta para gestionar tareas diarias, horas extras y notas importantes.</p>
      </div>
    </div>
  );
}

export default Portada;
