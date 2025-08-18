import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setOk(null); setLoading(true);
    try {
      await register(email, password, fullName);
      setOk("Registered! If email confirmation is required, check your inbox. You can sign in now.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h2 className="text-2xl font-bold">Create your account</h2>
        <p className="mt-1 text-sm text-gray-600">It takes less than a minute</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {err && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}
          {ok && <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{ok}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Register"}</Button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-black underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
