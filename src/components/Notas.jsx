import React, { useState, useEffect } from 'react';

function Notas() {
  const [notas, setNotas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  // Cargar las notas desde el servidor cuando el componente se monta
  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const response = await fetch(`${apiUrl}/notas`);
        if (!response.ok) throw new Error('Error al obtener las notas');
        
        const data = await response.json();
        setNotas(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotas();
  }, [apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newNota = { title, date, description };

    try {
      if (editIndex !== null) {
        // Editar nota
        const response = await fetch(`${apiUrl}/notas/${notas[editIndex]._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNota),
        });
        
        if (!response.ok) throw new Error('Error al actualizar la nota');
        
        const updatedData = await response.json();
        const updatedNotas = [...notas];
        updatedNotas[editIndex] = updatedData;
        setNotas(updatedNotas);
        setEditIndex(null);
      } else {
        // Añadir nueva nota
        const response = await fetch(`${apiUrl}/notas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNota),
        });
        
        if (!response.ok) throw new Error('Error al añadir la nota');
        
        const data = await response.json();
        setNotas([...notas, data]); // Añadir nueva nota al estado
      }

      setTitle('');
      setDate('');
      setDescription('');
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    const nota = notas[index];
    setTitle(nota.title);
    setDate(nota.date);
    setDescription(nota.description);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    const notaId = notas[index]._id;
    try {
      const response = await fetch(`${apiUrl}/notas/${notaId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar la nota');
      
      const updatedNotas = notas.filter((_, i) => i !== index);
      setNotas(updatedNotas);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section id="notas" className="form-section">
      <div className="section-header">
        <h2>Notas</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cerrar' : 'Añadir Nota'}
        </button>
      </div>

      {/* Listado de Notas */}
      <div className="notas-list">
        {notas.length > 0 ? (
          notas.map((nota, index) => (
            <div key={nota._id} className="nota-item">
              <strong>{nota.title}</strong> - {new Date(nota.date).toLocaleDateString()}
              <p>{nota.description}</p>
              <div className="button-group">
                <button onClick={() => handleEdit(index)}>Editar</button>
                <button className="button-delete" onClick={() => handleDelete(index)}>Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay notas registradas</p>
        )}
      </div>

      {/* Formulario de añadir/modificar nota */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input 
              type="text" 
              placeholder="Título" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Fecha</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              placeholder="Descripción" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>
          <button type="submit">{editIndex !== null ? 'Guardar Cambios' : 'Añadir Nota'}</button>
        </form>
      )}
    </section>
  );
}

export default Notas;
