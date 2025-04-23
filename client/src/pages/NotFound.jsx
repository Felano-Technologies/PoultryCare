import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl mt-4 mb-6">Oops! Page not found.</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Go back to homepage
      </Link>
    </div>
  );
};

export default NotFound;
