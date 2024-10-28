import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    // Usar la URL completa de la API desde las variables de entorno
    const apiUrl = import.meta.env.VITE_API_URL

    console.log('API URL:', apiUrl)  // Verificar que la URL se imprime correctamente

    try {
      console.log('Enviando datos:', { email, password })

      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      console.log('Respuesta de la API:', response)

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)  // Mostrar el mensaje de error del backend
        return
      }

      const data = await response.json()
      console.log('Datos devueltos:', data)

      // Simular autenticación estableciendo un "token" en el localStorage
      localStorage.setItem('token', '123456789')
      navigate('/dashboard')  // Redirige al dashboard

    } catch (error) {
      console.error('Error en el login:', error)
      alert('Error en el login. Por favor, intente nuevamente.')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Ingresa tu correo" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Ingresa tu contraseña" 
              required 
            />
          </div>
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}

export default Login
