import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const getUserNow = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUser(data.user ?? null);
    };
    getUserNow();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil logout");
    if (location.pathname !== "/") navigate("/");
  };

  return (
    <header className="w-full bg-sky-50/95 backdrop-blur-md border-b border-sky-100 sticky top-0 z-40 text-sky-700">
      <div className="max-w-5x1 mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-sky-700">
          Dfaalt Convert
        </Link>
        <nav className="flex items-center gap-3">
          {!user ? (
            <Link
              to="/auth"
              className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 font-semibold"
            >
              Sign In
            </Link>
          ) : (
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-lg border-2 border-sky-600 text-sky-700 font-semibold hover:bg-sky-50"
            >
              Sign Out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Header;
