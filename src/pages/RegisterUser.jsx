import { useState } from "react";
import { PostUser } from "../api/api.user";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const GROUPS_DICT = {
  Administrador_tienda: 1,
  Vendedor: 2
}

function RegisterUser() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    is_staff: false,
    password: "",
    groups: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.groups) {
      alert("Selecciona un grupo");
      return;
    }

    const dataToSend = {
      ...formData,
      groups: [Number(formData.groups)]
    };

    try {
      await PostUser(dataToSend);
      console.log("Enviado con éxito:", dataToSend);
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 p-8'>
      <header className="flex flex-row flex-wrap justify-between items-center bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mb-8 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Registrar Usuario</h1>
        <Navbar />
      </header>
      <div className="flex justify-center">
        <div className="max-w-md w-full shadow-2xl rounded-2xl bg-white dark:bg-gray-800 p-6 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="first_name"
              placeholder="Firstname"
              value={formData.first_name}
              onChange={handleChange}
              required={true}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            />
            <input
              name="last_name"
              placeholder="Lastname"
              value={formData.last_name}
              onChange={handleChange}
              required={true}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            />

            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required={true}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            />
            <input
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              required={true}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            />

            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                name="is_staff"
                type="checkbox"
                checked={formData.is_staff}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              ¿Staff?
            </label>

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required={true}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">Debe contener al menos 8 caracteres</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">No debe contener información relacionada con el usuario, como nombre, fecha de nacimiento, correo</p>

            <select
              name="groups"
              value={formData.groups}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            >
              <option value="" disabled>Selecciona un rol</option>
              {Object.entries(GROUPS_DICT).map(([label, id]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>

            <button type="submit" className="w-full bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold">
              <FontAwesomeIcon icon={faUserPlus} />
              Registrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
