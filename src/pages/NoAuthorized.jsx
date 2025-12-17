

function NoAuthorized() {
    return (
        <div className="h-full min-h-screen bg-gray-1000 dark:bg-gray-900 flex flex-col justify-center items-center p-8">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-10 max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    No tienes autorización para acceder a esta página.
                </p>
                <img
                    src="/unauthorized_access.svg"
                    alt="Acceso Denegado"
                    className="w-48 h-48 mx-auto mb-6"
                />
                <a
                    href="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                    Volver al Inicio
                </a>
            </div>
        </div>
    );
}

export default NoAuthorized;