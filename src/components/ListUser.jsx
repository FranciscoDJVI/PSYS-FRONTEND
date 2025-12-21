import { useState, useEffect } from "react";
import { GetUsers } from "../api/api.user";
import logger from "../utils/logger";
import CustomTag from "./customTag";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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


  return (
    <div className="bg-white dark:bg-gray-800 mb-5">
      <div className='mt-5 ml-5 mr-5 p-2 border border-gray-300 dark:border-gray-700 rounded-xl text-xl '>Roles:
        <ul className="flex flex-row flex-wrap gap-4 p-2">
          <li ><FontAwesomeIcon icon={faTag} className="text-red-600" />Admin</li>
          <li ><FontAwesomeIcon icon={faTag} className="text-cyan-600" />Administrado tienda</li>
          <li ><FontAwesomeIcon icon={faTag} className="text-green-500" />Vendedor</li>
        </ul>
      </div>
      <h1 className="text-xl text-white p-2 m-5 rounded-xl font-extrabold">Usuarios</h1>
      <div className="">
        {Array.isArray(users) ? (
          users.map((user, index) => (
            <div key={index} className="text-xl m-5 p-2 rounded-xl mt-2">
              <div><CustomTag username={user.username} rol={user.roles} /></div>
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
