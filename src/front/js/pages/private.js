import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Private = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setMessage('Bienvenido a la página privada!');
    }
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">Página Privada</h2>
        <p className="text-center mb-4">{message}</p>
        <div className="d-flex justify-content-center">
          <button 
            className="btn btn-primary mt-3 px-5 py-2"
            onClick={() => navigate('/login')}
          >
            Ir a Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Private;
