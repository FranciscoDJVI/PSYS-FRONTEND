import { useState, useEffect } from "react";
import { GetUsers } from "../api/api.user";
import logger from "../utils/logger";


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
    <div className="bg-gray-200 dark:bg-gray-800">
      <h1 className="text-xl text-white p-2 rounded-xl font-extrabold">Usuarios</h1>
      <div className="flex flex-col items-left mt-5">
        {Array.isArray(users) ? (
          users.map((user) => (
            <div key={user.id} className="text-xl m-5 hover:bg-gray-700 p-2 rounded-xl mt-2">
              <div>{user.username}</div>
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
