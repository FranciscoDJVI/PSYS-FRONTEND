import ListUsers from "../components/ListUser";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";


function Users() {
  return (
    <div className='h-ful min-h-screen bg-gray-100 dark:bg-gray-900 p-8'>
      <header className="flex flex-row  flex-wrap justify-between items-center bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mb-8 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Usuarios</h1>
        <Navbar />
      </header>
      <div className="p-6 overflow-x-auto">
        <div className="min-w-full shadow-2xl rounded-2xl bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="mb-6 flex justify-end">
            <Link to={'/register-user'} className="bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-xl text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold">
              Registrar Usuario
              <FontAwesomeIcon icon={faUserPlus} />
            </Link>
          </div>
          <ListUsers />
        </div>
      </div>
    </div>
  )
}

export default Users;
