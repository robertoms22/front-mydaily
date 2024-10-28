import React, { useState, useEffect } from 'react';

function Daily() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null); 
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  // Cargar las notas desde el servidor cuando el componente se monta
  useEffect(() => {
    fetch(`${apiUrl}/daily`)
      .then((response) => response.json())
      .then((data) => setNotes(data))
      .catch((error) => console.error('Error al obtener las notas diarias:', error));
  }, [apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newNote = { title, date, description };

    try {
      if (editIndex !== null) {
        // Editar nota
        const updatedNote = await fetch(`${apiUrl}/daily/${notes[editIndex]._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNote),
        });
        const updatedData = await updatedNote.json();
        const updatedNotes = [...notes];
        updatedNotes[editIndex] = updatedData;
        setNotes(updatedNotes);
        setEditIndex(null);
      } else {
        // Añadir nueva nota
        const response = await fetch(`${apiUrl}/daily`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNote),
        });
        const data = await response.json();
        setNotes([...notes, data]); // Añadir nueva nota al estado
      }

      setTitle('');
      setDate('');
      setDescription('');
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar la nota diaria:', error);
    }
  };

  const handleEdit = (index) => {
    const note = notes[index];
    setTitle(note.title);
    setDate(note.date);
    setDescription(note.description);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    const noteId = notes[index]._id;
    try {
      await fetch(`${apiUrl}/daily/${noteId}`, {
        method: 'DELETE',
      });
      const updatedNotes = notes.filter((_, i) => i !== index);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error al eliminar la nota diaria:', error);
    }
  };

  return (
    <section id="daily" className="form-section">
      <div className="section-header">
        <h2>Daily</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cerrar' : 'Añadir Nota'}
        </button>
      </div>

      {/* Listado de Notas */}
      <div className="notes-list">
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <div key={note._id} className="note-item">
              <strong>{note.title}</strong> - {note.date}
              <p>{note.description}</p>
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

export default Daily;
