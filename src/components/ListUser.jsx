import { useState, useEffect } from "react";
import { GetUsers } from "../api/api.user";
import logger from "../utils/logger";
import CustomTag from "./customTag";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { DeleteUser } from "../api/api.user";
import toast from "react-hot-toast";

function ListUsers() {

  const [users, setUsers] = useState([])

  const LoadUsers = async () => {

    try {
      const response = await GetUsers();
      const data = response.data.results || response.data;
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      logger.error('Error to load users:', error)
    }

  }
  useEffect(() => {
    LoadUsers();
  }, [])

  const handleDeleteUser = async (id) => {
    logger.warn("Intentando eliminar ID:", id);

    if (!id) {
      logger.error("No se proporcionó un ID válido");
      return;
    }

    try {
      const response = await DeleteUser(id);

      if (response.status === 204) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        toast.success('Usuario eiminado con exito')
      }
    } catch (error) {
      logger.error("Error deleting user", error);

      if (error.response) {
        logger.error("Datos del error del servidor:", error.response.data);
        alert(`Error del servidor: ${error.response.data.message || 'Error interno'}`);
      }
    }
  }; return (
    <div className="bg-white dark:bg-gray-800 mb-5 shadow-lg rounded-lg overflow-hidden">
      <div className='mt-5 ml-5 mr-5 p-2 border border-gray-300 dark:border-gray-700 rounded-xl text-xl '>Roles:
        <ul className="flex flex-row flex-wrap gap-4 p-2">
          <li ><FontAwesomeIcon icon={faTag} className="text-red-500" />Admin</li>
          <li ><FontAwesomeIcon icon={faTag} className="text-cyan-600" />Administrado tienda</li>
          <li ><FontAwesomeIcon icon={faTag} className="text-green-500" />Vendedor</li>
        </ul>
      </div>
      <h1 className="text-xl text-white p-2 m-5 rounded-xl font-extrabold">Usuarios</h1>

      <div className="grid grid-cols-3 gap-4 place-items-center p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-xl text-white font-bold">
        <div className="text-left">Nombre</div>
        <div className="text-left">Rol</div>
        <div className="text-center">Acciones</div>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {Array.isArray(users) ? (
          users.map((user, index) => (
            <div key={user.id} className="grid grid-cols-3 gap-4 place-items-center p-5 text-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 border-b border-gray-200 dark:border-gray-600">
              <div className="text-left"><CustomTag username={user.username} rol={user.roles} /></div>
              <div className="text-left">{user.roles}</div>
              <div className="flex gap-2 justify-center">
                <FontAwesomeIcon icon={faPen} className="text-blue-500 hover:text-blue-700 transition-colors" />
                <button type="button" onClick={() => handleDeleteUser(user.id)}><FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700 transition-colors" />
                </button>
              </div>
              <h2>{typeof (user.id)}</h2>
            </div>
          ))
        ) : (
          <p>No se encontraron usuarios o el formato es incorrecto.</p>
        )}
      </div>
    </div>
  );
}

export default ListUsers;
