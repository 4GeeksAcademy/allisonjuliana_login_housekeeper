import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id_branche, setIdBranche] = useState('');
  const [branches, setBranches] = useState([]); // Aquí guardamos las sucursales
  const [emailError, setEmailError] = useState(''); // Estado para mostrar error en el email
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  // Función para cargar las sucursales desde el backend
  const loadBranches = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/branches`);
      if (response.ok) {
        const data = await response.json();
        setBranches(data); // Guardamos las sucursales en el estado
      } else {
        console.error('Error al cargar las sucursales:', response.status);
      }
    } catch (error) {
      console.error('Error al cargar las sucursales:', error);
    }
  };

  // Llamamos a loadBranches cuando el componente se monte
  useEffect(() => {
    loadBranches();
  }, []);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  // Validación del email cuando el campo pierde el foco
  const handleEmailBlur = () => {
    if (!email.includes('@')) {
      setEmailError('El email debe contener el símbolo "@"');
    } else {
      setEmailError('');
    }
  };

  const handleSignup = async () => {
    if (!nombre || !email || !password || !id_branche) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (emailError) {
      alert('Por favor corrige los errores antes de continuar');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/housekeepers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
          id_branche,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Registro exitoso!');
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">Formulario de Registro</h2>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa tu nombre"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur} // Validamos cuando el campo pierde el foco
            placeholder="Ingresa tu email"
          />
          {emailError && <small className="text-danger">{emailError}</small>}
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <div className="form-group">
          <label>Sucursal</label>
          <select
            className="form-control"
            value={id_branche}
            onChange={(e) => setIdBranche(e.target.value)}
          >
            <option value="">Selecciona una sucursal</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.nombre}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary btn-block" onClick={handleSignup} disabled={emailError}>
          Registrarse
        </button>
        <div className="text-center mt-3">
          <button className="btn btn-link" onClick={() => navigate('/login')}>
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
