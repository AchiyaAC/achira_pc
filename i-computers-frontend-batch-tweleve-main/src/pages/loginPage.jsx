import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FiArrowLeft, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import UserContext from "../context/userContext";

export default function LoginPage() {
  const { login, googleLogin, isAuthenticated, isAdmin } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  useEffect(() => { if (isAuthenticated) navigate(isAdmin ? "/admin" : (location.state?.from || "/"), { replace: true }); }, [isAuthenticated, isAdmin, navigate, location.state]);

  const finish = (result) => { if (!result?.success) return; navigate(result.user?.role === "admin" ? "/admin" : (location.state?.from || "/"), { replace: true }); };
  const submit = async (e) => { e.preventDefault(); setBusy(true); const result = await login(email.trim(), password); setBusy(false); finish(result); };
  const handleGoogle = async (response) => { if (!response?.credential) return; setBusy(true); const result = await googleLogin(response.credential); setBusy(false); finish(result); };

  return <div className="auth-shell"><div className="auth-showcase"><Link to="/" className="text-white/80 hover:text-white"><FiArrowLeft/> Back to store</Link><div className="mt-auto"><div className="brand-mark mb-6 bg-white text-slate-900">iC</div><h1 className="text-4xl font-black tracking-tight">Build better.<br/><span className="text-blue-400">Play harder.</span></h1><p className="mt-5 max-w-md text-slate-300">Your place for PC components, accessories and reliable gear.</p><div className="mt-8 flex gap-3 text-sm text-slate-300"><span className="pill-dark">⚡ Fast shopping</span><span className="pill-dark">🛡️ Secure accounts</span></div></div></div><div className="auth-card-wrap"><div className="w-full max-w-md"><div className="mb-6 lg:hidden"><Link to="/" className="brand-inline"><span className="brand-mark">iC</span> i-Computers</Link></div><div className="auth-card"><div className="mb-7"><p className="section-kicker">Welcome back</p><h2 className="mt-2 text-3xl font-black text-slate-900">Sign in to your account</h2><p className="mt-2 text-sm text-slate-500">Access your orders, profile and more.</p></div>{googleEnabled ? <><GoogleLogin onSuccess={handleGoogle} onError={() => {}} width="100%" text="continue_with" shape="rectangular" theme="outline" size="large"/><div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200"/>OR<span className="h-px flex-1 bg-slate-200"/></div></> : <div className="mb-5 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">Google Login is ready. Add <b>VITE_GOOGLE_CLIENT_ID</b> to the frontend .env to enable the button.</div>}<form onSubmit={submit} className="space-y-4"><label className="field-label">Email<input className="field-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required/></label><label className="field-label">Password<div className="relative"><input className="field-input pr-12" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required/><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword(v => !v)}>{showPassword ? <FiEyeOff/> : <FiEye/>}</button></div></label><button disabled={busy} className="primary-btn w-full">{busy ? "Please wait..." : "Sign In"}</button></form><div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500"><FiShield className="text-blue-600"/> Protected account access</div><p className="mt-6 text-center text-sm text-slate-500">Don't have an account? <Link className="font-bold text-blue-600" to="/register">Create one</Link></p></div></div></div></div>;
}
