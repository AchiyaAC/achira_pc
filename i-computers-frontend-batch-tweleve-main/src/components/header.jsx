import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiSettings, FiGrid, FiMenu, FiX } from "react-icons/fi";
import { useUser } from "../context/userContext";
import { getCartCount } from "../lib/cart";


export default function Header() {
  const { user, isAdmin, logout } = useUser();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(getCartCount());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const refresh = () => setCartCount(getCartCount());
    window.addEventListener("cartUpdated", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("cartUpdated", refresh); window.removeEventListener("storage", refresh); };
  }, []);

  const handleLogout = () => { logout(); navigate("/"); setMobileOpen(false); };
  const linkClass = ({ isActive }) => `transition ${isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="brand-mark">iC</div>
          <div><div className="text-lg font-black tracking-tight text-slate-900">ACHIRA COMPUTERS</div><div className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-600">PC • Components • Gear</div></div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          {user && <NavLink to="/my-orders" className={linkClass}>My Orders</NavLink>}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/cart" className="icon-button relative" title="Cart"><FiShoppingCart size={20}/>{cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>}</Link>
          {user ? (
            <div className="group relative ml-2">
              <button className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-50"><span className="avatar">{(user.name || "U").charAt(0).toUpperCase()}</span><span className="max-w-28 truncate text-sm font-semibold text-slate-700">{user.name || "Account"}</span></button>
              <div className="invisible absolute right-0 top-full mt-2 w-56 translate-y-1 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="border-b px-3 py-2"><p className="truncate text-sm font-bold">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div>
                <Link to="/settings" className="menu-item"><FiSettings/> Settings</Link>
                {isAdmin && <Link to="/admin" className="menu-item text-blue-600"><FiGrid/> Admin Panel</Link>}
                <button onClick={handleLogout} className="menu-item w-full text-red-600"><FiLogOut/> Logout</button>
              </div>
            </div>
          ) : <><Link to="/login" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">Login</Link><Link to="/register" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">Get Started</Link></>}
          {isAdmin && <Link to="/admin" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">Admin</Link>}
        </div>

        <div className="flex items-center gap-1 md:hidden"><Link to="/cart" className="icon-button relative"><FiShoppingCart size={20}/>{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</Link><button className="icon-button" onClick={() => setMobileOpen(v => !v)}>{mobileOpen ? <FiX size={22}/> : <FiMenu size={22}/>}</button></div>
      </div>

      {mobileOpen && <div className="border-t bg-white px-4 py-4 md:hidden"><div className="grid gap-2"><NavLink onClick={() => setMobileOpen(false)} to="/" end className="mobile-link">Home</NavLink><NavLink onClick={() => setMobileOpen(false)} to="/products" className="mobile-link">Products</NavLink>{user && <NavLink onClick={() => setMobileOpen(false)} to="/my-orders" className="mobile-link">My Orders</NavLink>}{user ? <><Link onClick={() => setMobileOpen(false)} to="/settings" className="mobile-link">Settings</Link>{isAdmin && <Link onClick={() => setMobileOpen(false)} to="/admin" className="mobile-link font-bold text-blue-600">Admin Panel →</Link>}<button onClick={handleLogout} className="mobile-link text-left text-red-600">Logout</button></> : <><Link onClick={() => setMobileOpen(false)} to="/login" className="mobile-link">Login</Link><Link onClick={() => setMobileOpen(false)} to="/register" className="mobile-link font-bold text-blue-600">Create Account</Link></>}</div></div>}
    </header>
  );
}
