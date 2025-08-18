import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="card text-center">
      <h2 className="text-2xl font-bold">404</h2>
      <p className="mt-2 text-gray-600">Page not found</p>
      <Link className="btn-primary mt-4 inline-block" to="/">Go home</Link>
    </div>
  );
}
