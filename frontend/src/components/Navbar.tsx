import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold">MiniBlog</Link>

        {!token ? (
          <div className="flex items-center gap-3">
            <Link className={`nav-link ${location.pathname==="/login" ? "text-black" : ""}`} to="/login">Sign in</Link>
            <Link className="btn-primary" to="/register">Register</Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Hi, {user?.email}</span>
            <Link className="nav-link" to="/create">Create</Link>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Button className="btn-ghost" onClick={() => { logout(); navigate("/"); }}>
              Sign out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}