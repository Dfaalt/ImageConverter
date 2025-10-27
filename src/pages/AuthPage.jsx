import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [tab, setTab] = useState("signin");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingMagic, setLoadingMagic] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const navigate = useNavigate();

  // form sign in
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // form sign up
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirmPassword, setSuConfirmPassword] = useState("");

  const [showSiPwd, setShowSiPwd] = useState(false);
  const [showSuPwd, setShowSuPwd] = useState(false);
  const [showSuConfirmPwd, setShowSuConfirmPwd] = useState(false);

  // magic link email
  const [mlEmail, setMlEmail] = useState("");

  const redirectHome = window.location.origin + "/";

  // google OAuth
  const signInWithGoogle = async () => {
    try {
      setLoadingGoogle(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectHome },
      });
      if (error) throw error;
    } catch (e) {
      toast.error("Gagal login dengan Google");
      setLoadingGoogle(false);
    }
  };

  // magic link
  const signInWithMagicLink = async () => {
    if (!mlEmail || !mlEmail.includes("@")) {
      toast.error("Masukkan email yang valid!");
      return;
    }
    try {
      setLoadingMagic(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: mlEmail,
        options: { emailRedirectTo: redirectHome },
      });
      if (error) throw error;
      toast.success("Cek email kamu untuk link login!");
    } catch (e) {
      toast.error("Gagal mengirim link login. coba lagi!");
    } finally {
      setLoadingMagic(false);
    }
  };

  // Sign In (Email + Password)
  const signInWithEmailPassword = async (e) => {
    e.preventDefault();
    if (!siEmail || !siPassword) {
      toast.error("Email & password wajib diisi.");
      return;
    }
    try {
      setLoadingEmail(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: siEmail,
        password: siPassword,
      });
      if (error) throw error;
      toast.success("Welcome back!");
      // session akan masuk; listener di app kamu akan sync isLoggedIn
      window.location.href = redirectHome;
    } catch (e) {
      // beberapa pesan umum dari Supabase:
      // "Invalid login credentials" | "Email not confirmed"
      const msg = e?.message || "Gagal login. Coba lagi.";
      toast.error(msg);
    } finally {
      setLoadingEmail(false);
    }
  };

  // Sign Up (Email + Password)
  const signUpWithEmail = async (e) => {
    e.preventDefault();
    if (!suEmail || !suPassword) {
      toast.error("Email & password wajib diisi.");
      return;
    }
    if (suPassword.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }
    if (suPassword !== suConfirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }
    try {
      setLoadingEmail(true);
      const { error } = await supabase.auth.signUp({
        email: suEmail,
        password: suPassword,
        options: { emailRedirectTo: redirectHome }, // jika confirm email ON
      });
      if (error) throw error;
      toast.success(
        "Akun dibuat. Jika verifikasi email ON, silakan cek email untuk konfirmasi."
      );
      setTab("signin");
    } catch (e) {
      toast.error(e?.message || "Gagal membuat akun.");
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-700 via-sky-800 to-slate-900">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          {/* Left: brand/intro */}
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:block">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs text-white/80">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400/90" />
                Secure Auth
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Welcome to Dfaalt Convert
              </h2>
              <p className="text-white/80">
                Masuk cepat & aman. Email & Password. Magic Link tanpa password.
              </p>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center gap-2">
                  <span className="i-lucide-bolt h-5 w-5" /> Login 1-klik via
                  Google sementara masih maintenance
                </li>
                <li className="flex items-center gap-2">
                  <span className="i-lucide-lock h-5 w-5" /> Session persist &
                  auto refresh
                </li>
                <li className="flex items-center gap-2">
                  <span className="i-lucide-mail-check h-5 w-5" /> OTP & email
                  verification
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Auth card */}
          <div className="relative">
            <div className="absolute -inset-0.5 -z-10 rounded-3xl bg-gradient-to-r from-sky-500/40 to-cyan-400/40 blur-2xl" />
            <div className="rounded-2xl border border-white/10 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:bg-white/95 sm:p-8">
              {/* Header */}
              <div className="mb-2 space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-sky-800">
                  Masuk ke Dfaalt Convert
                </h1>
              </div>

              {/* ========== 1) PRIMARY: GOOGLE ========== */}
              <div className="mb-2">
                <button
                  onClick={signInWithGoogle}
                  disabled={loadingGoogle}
                  aria-busy={loadingGoogle}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingGoogle ? (
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-20 fill-none"
                      />
                      <path
                        d="M4 12a8 8 0 0 1 8-8"
                        className="opacity-80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 10.2v3.6h5.1c-.2 1.1-.8 2-1.7 2.7l2.7 2.1c1.6-1.5 2.6-3.8 2.6-6.5 0-.6-.1-1.2-.2-1.9H12z"
                      />
                      <path
                        fill="#34A853"
                        d="M6.6 13.9l-.8.6-2.2 1.7C5.1 19.1 8.3 21 12 21c2.4 0 4.4-.8 5.9-2.2l-2.7-2.1c-.7.5-1.7.8-3.2.8-2.5 0-4.6-1.7-5.4-4.1z"
                      />
                      <path
                        fill="#4A90E2"
                        d="M3.6 7.8C2.9 9.2 2.9 10.8 3.6 12.2l3-2.3c-.2-.5-.3-1-.3-1.6s.1-1.1.3-1.6L3.6 7.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M12 4.5c1.3 0 2.5.4 3.5 1.3l2.6-2.6C16.3 1.9 14.3 1 12 1 8.3 1 5.1 2.9 3.6 6l3 2.3C7.4 6 9.5 4.5 12 4.5z"
                      />
                    </svg>
                  )}
                  <span>
                    {loadingGoogle ? "Mengalihkan..." : "Continue with Google"}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-3 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                <span className="text-xs uppercase tracking-wider text-slate-400">
                  or
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent" />
              </div>

              {/* ========== 2) SECONDARY: EMAIL + PASSWORD (dengan Tabs) ========== */}
              <div className="mb-2">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Email & Password
                </p>

                {/* Tabs */}
                <div
                  role="tablist"
                  aria-label="Auth Tabs"
                  className="relative mb-6 grid grid-cols-2 rounded-xl border border-sky-600/20 bg-sky-50 p-1"
                >
                  <button
                    role="tab"
                    aria-selected={tab === "signin"}
                    onClick={() => setTab("signin")}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      tab === "signin"
                        ? "bg-white text-sky-700 shadow-sm"
                        : "text-sky-700/70 hover:text-sky-700"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    role="tab"
                    aria-selected={tab === "signup"}
                    onClick={() => setTab("signup")}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      tab === "signup"
                        ? "bg-white text-sky-700 shadow-sm"
                        : "text-sky-700/70 hover:text-sky-700"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Forms */}
                {tab === "signin" ? (
                  <form
                    onSubmit={signInWithEmailPassword}
                    className="space-y-4"
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="si-email"
                          className="text-xs font-medium text-slate-600"
                        >
                          Email
                        </label>
                        <input
                          id="si-email"
                          type="email"
                          placeholder="you@example.com"
                          value={siEmail}
                          onChange={(e) => setSiEmail(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.15)]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="si-password"
                          className="text-xs font-medium text-slate-600"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="si-password"
                            type={showSiPwd ? "text" : "password"}
                            placeholder="••••••••"
                            value={siPassword}
                            onChange={(e) => setSiPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-11 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.15)]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSiPwd((v) => !v)}
                            aria-label={
                              showSiPwd ? "Hide password" : "Show password"
                            }
                            className="absolute inset-y-0 right-3 my-auto inline-flex h-5 w-5 items-center justify-center text-slate-400 hover:text-slate-600"
                          >
                            {showSiPwd ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        disabled={loadingEmail}
                        aria-busy={loadingEmail}
                        className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-sky-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loadingEmail ? (
                          <>
                            <svg
                              className="h-4 w-4 animate-spin"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="opacity-20 fill-none"
                              />
                              <path
                                d="M4 12a8 8 0 0 1 8-8"
                                className="opacity-80"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                            </svg>
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/reset-password")}
                        disabled={loadingEmail}
                        className="text-sm font-semibold text-sky-700 underline-offset-4 transition hover:text-sky-800 hover:underline disabled:opacity-60"
                        title="Pergi ke halaman reset password"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={signUpWithEmail} className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="su-email"
                          className="text-xs font-medium text-slate-600"
                        >
                          Email
                        </label>
                        <input
                          id="su-email"
                          type="email"
                          placeholder="you@example.com"
                          value={suEmail}
                          onChange={(e) => setSuEmail(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.15)]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="su-password"
                          className="text-xs font-medium text-slate-600"
                        >
                          Password{" "}
                          <span className="text-slate-400">(min 8)</span>
                        </label>
                        <div className="relative">
                          <input
                            id="su-password"
                            type={showSuPwd ? "text" : "password"}
                            placeholder="••••••••"
                            value={suPassword}
                            onChange={(e) => setSuPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-11 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.15)]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSuPwd((v) => !v)}
                            aria-label={
                              showSuPwd ? "Hide password" : "Show password"
                            }
                            className="absolute inset-y-0 right-3 my-auto inline-flex h-5 w-5 items-center justify-center text-slate-400 hover:text-slate-600"
                          >
                            {showSuPwd ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="su-confirm"
                          className="text-xs font-medium text-slate-600"
                        >
                          Confirm
                        </label>
                        <div className="relative">
                          <input
                            id="su-confirm"
                            type={showSuConfirmPwd ? "text" : "password"}
                            placeholder="••••••••"
                            value={suConfirmPassword}
                            onChange={(e) =>
                              setSuConfirmPassword(e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-11 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.15)]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSuConfirmPwd((v) => !v)}
                            aria-label={
                              showSuConfirmPwd
                                ? "Hide password"
                                : "Show password"
                            }
                            className="absolute inset-y-0 right-3 my-auto inline-flex h-5 w-5 items-center justify-center text-slate-400 hover:text-slate-600"
                          >
                            {showSuConfirmPwd ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loadingEmail}
                      aria-busy={loadingEmail}
                      className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-sky-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingEmail ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              className="opacity-20 fill-none"
                            />
                            <path
                              d="M4 12a8 8 0 0 1 8-8"
                              className="opacity-80"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                          </svg>
                          Creating...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Divider */}
              <div className="my-5 h-px w-full bg-slate-200" />

              {/* ========== 3) TERTIARY: MAGIC LINK (opsional) ========== */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Atau pakai Magic Link (tanpa password)
                  </p>
                </div>
                <div className="flex gap-2">
                  <label htmlFor="ml-email" className="sr-only">
                    Email untuk Magic Link
                  </label>
                  <input
                    id="ml-email"
                    type="email"
                    placeholder="you@example.com"
                    value={mlEmail}
                    onChange={(e) => setMlEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.15)]"
                  />
                  <button
                    onClick={signInWithMagicLink}
                    disabled={loadingMagic}
                    aria-busy={loadingMagic}
                    className="whitespace-nowrap rounded-lg border-2 border-sky-600 px-4 py-3 font-semibold text-sky-700 transition hover:-translate-y-px hover:bg-sky-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingMagic ? "Mengirim..." : "Send Magic Link"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Kami kirim tautan sekali klik ke email kamu.
                </p>
              </div>

              <p className="mt-6 text-center text-xs text-slate-500">
                Dengan masuk, kamu setuju pada ketentuan & privasi Dfaalt
                Convert.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
