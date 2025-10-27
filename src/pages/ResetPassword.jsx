import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [mode, setMode] = useState("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Deteksi apakah datang dari link email Supabase (session sementara)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setMode("update");
      } else {
        setMode("reguest");
      }
    };
    checkSession();
  }, []);

  // kirim link reset password (mode request)
  const sendResetLink = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Masukkan email yang valid.");
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // penting: arahkan kembali ke halaman yang sama
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      toast.success("Link reset password dikirim ke email kamu!");
    } catch (e) {
      toast.error(e?.message || "Gagal mengirim link reset.");
    } finally {
      setLoading(false);
    }
  };

  // fungsi update password (mode update)
  const resetPassword = async (e) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password berhasil diperbarui. Silakan login kembali.");
      window.location.href = "/auth";
    } catch (e) {
      toast.error(e?.message || "Gagal memperbarui password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-sky-600 to-sky-900">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-6 shadow-xl">
        {mode === "request" ? (
          <>
            {/* Mode minta link reset */}
            <h1 className="text-2xl font-bold text-center text-sky-700 mb-4">
              Reset Password
            </h1>
            <p className="text-center text-gray-600 mb-4">
              Masukkan email kamu, kami akan mengirimkan link reset password.
            </p>
            <form onSubmit={sendResetLink} className="space-y-4">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 ring-sky-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold bg-sky-600 text-white hover:bg-sky-700 transition disabled:opacity-60"
              >
                {loading ? "Mengirim..." : "Kirim Link Reset"}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Mode update password baru */}
            <h1 className="text-2xl font-bold text-center text-sky-700 mb-4">
              Buat Password Baru
            </h1>
            <p className="text-center text-gray-600 mb-4">
              Masukkan password baru untuk akun kamu.
            </p>
            <form onSubmit={resetPassword} className="space-y-4">
              <input
                type="password"
                placeholder="Password baru (min 8)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 ring-sky-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold bg-sky-600 text-white hover:bg-sky-700 transition disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default ResetPassword;
