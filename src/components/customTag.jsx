import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CustomTag({ username, rol }) {
  const roleColors = {
    Administrador_tienda: "text-cyan-600",
    Vendedor: "text-green-500",
    Admin: "text-red-600",
    default: "text-gray-400"
  };


  const iconColor = roleColors[rol] || roleColors.default;

  return (
    <div className="flex items-center gap-2 p-2 py-1 rounded-xl w-fit bg-gray-200 dark:bg-gray-700">
      <h1 className="text-xl font-semibold text-black dark:text-white capitalize p-2">{username}</h1>
      <FontAwesomeIcon
        icon={faTag}
        className={`${iconColor} transition-colors duration-300`}
      />
    </div>
  );
}

export default CustomTag;
