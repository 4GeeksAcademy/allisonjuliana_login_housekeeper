import React, { useState, useEffect } from 'react';

const HouseKeeper = () => {
  const [housekeepers, setHousekeepers] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id_branche, setIdBranche] = useState('');
  const [branches, setBranches] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  const loadHousekeepers = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/housekeepers`);
      if (response.ok) {
        const data = await response.json();
        setHousekeepers(data);
      } else {
        console.error("Error al obtener los housekeepers:", response.status);
      }
    } catch (error) {
      console.error('Error al obtener los housekeepers:', error);
    }
  };

  const loadBranches = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/branches`);
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      } else {
        console.error("Error al obtener las sucursales:", response.status);
      }
    } catch (error) {
      console.error('Error al obtener las sucursales:', error);
    }
  };

  const createHouseKeeper = async () => {
    if (!nombre || !email || !password || !id_branche) {
      alert('Por favor, completa todos los campos');
      return;
    }

    if (!email.includes('@')) {
      alert('Por favor, ingresa un email válido');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/housekeepers`, {
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
        setHousekeepers([...housekeepers, data]);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error al crear el housekeeper:", errorData.message);
      }
    } catch (error) {
      console.error('Error al crear el housekeeper:', error);
    }
  };

  const updateHouseKeeper = async () => {
    if (!nombre || !email || !password || !editingId || !id_branche) {
      alert('Por favor, completa todos los campos para editar');
      return;
    }

    if (!email.includes('@')) {
      alert('Por favor, ingresa un email válido');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/housekeepers/${editingId}`, {
        method: 'PUT',
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
        setHousekeepers(
          housekeepers.map(item => (item.id === editingId ? data : item))
        );
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error al editar el housekeeper:", errorData.message);
      }
    } catch (error) {
      console.error('Error al editar el housekeeper:', error);
    }
  };

  const deleteHouseKeeper = async (id) => {
    const isConfirmed = window.confirm("¿Estás seguro de que quieres eliminar este housekeeper?");

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/housekeepers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHousekeepers(housekeepers.filter(item => item.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Error al eliminar el housekeeper:", errorData.message);
      }
    } catch (error) {
      console.error('Error al eliminar el housekeeper:', error);
    }
  };

  const resetForm = () => {
    setNombre('');
    setEmail('');
    setPassword('');
    setIdBranche('');
    setEditingId(null);
  };

  useEffect(() => {
    loadHousekeepers();
    loadBranches();
  }, []);

  const editHouseKeeper = (id) => {
    const housekeeperToEdit = housekeepers.find((hk) => hk.id === id);
    if (housekeeperToEdit) {
      setNombre(housekeeperToEdit.nombre);
      setEmail(housekeeperToEdit.email);
      setPassword(housekeeperToEdit.password);
      setIdBranche(housekeeperToEdit.id_branche);
      setEditingId(id);
    }
  };

  const cancelEdit = () => {
    resetForm();
  };

  return (
    <div className="container">
      <h1>Gestión de Housekeepers</h1>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{editingId ? 'Editar' : 'Crear'} Housekeeper</h5>

          <form>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="id_branche">Sucursal</label>
              <select
                className="form-control"
                id="id_branche"
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

            <div className="form-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={editingId ? updateHouseKeeper : createHouseKeeper}
              >
                {editingId ? 'Actualizar' : 'Crear'} Housekeeper
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-primary ml-2"
                  onClick={cancelEdit}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <h3 className="mt-4">Housekeepers Actuales</h3>
      <div className="table-responsive mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>ID Sucursal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {housekeepers.map((housekeeper) => (
              <tr key={housekeeper.id}>
                <td>{housekeeper.nombre}</td>
                <td>{housekeeper.email}</td>
                <td>{housekeeper.id_branche}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm mr-2"
                    onClick={() => editHouseKeeper(housekeeper.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => deleteHouseKeeper(housekeeper.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HouseKeeper;
