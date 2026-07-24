import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { RobotMascot } from "@/components/robots/RobotMascot";

const ku: React.CSSProperties = { fontFamily: "'Noto Kufi Arabic', sans-serif" };

function FloatingStar({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <div
      className="absolute rounded-full bg-white pointer-events-none"
      style={{
        left: `${x}%`, top: `${y}%`,
        width: size, height: size,
        animation: `star-twinkle ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

function OrbitRing({ color, radius, duration, reverse }: { color: string; radius: number; duration: number; reverse?: boolean }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: radius * 2,
        height: radius * 2,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        border: `1px solid ${color}`,
        opacity: 0.12,
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          background: color,
          boxShadow: `0 0 10px ${color}`,
          top: "50%",
          left: 0,
          transform: "translate(-50%, -50%)",
          animation: `orbit ${duration}s linear ${reverse ? "reverse" : ""} infinite`,
        }}
      />
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<"user" | "pass" | null>(null);

  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "هەڵەیەک ڕوویدا");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #010811 0%, #020c1f 50%, #010811 100%)" }}
    >
      {/* Stars */}
      {stars.map((s) => <FloatingStar key={s.id} {...s} />)}

      {/* Deep glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

      {/* Orbit rings */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 hidden lg:block">
        <OrbitRing color="#3b82f6" radius={180} duration={12} />
        <OrbitRing color="#8b5cf6" radius={260} duration={20} reverse />
        <OrbitRing color="#06b6d4" radius={340} duration={30} />
      </div>

      {/* Main layout */}
      <div className="relative w-full max-w-5xl mx-4 flex items-center gap-12 lg:gap-20">

        {/* Left: Robot showcase */}
        <div className="hidden lg:flex flex-col items-center gap-6 flex-1">
          {/* Glowing backdrop */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(59,130,246,0.15)", transform: "scale(1.5)" }} />
            <RobotMascot variant="login" size="xl" animate />
          </div>

          {/* Tagline */}
          <div className="text-center">
            <p className="text-white/60 text-sm" style={ku}>سیستەمی هوشیار بۆ بەڕێوەبردنی پەروەردە</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              {["داشبۆرد", "نوسراوەکان", "فەرمانبەران", "ڕاپۆرت"].map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    color: "#60a5fa",
                    fontFamily: "'Noto Kufi Arabic', sans-serif",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Login card */}
        <div className="flex-1 max-w-md w-full mx-auto lg:mx-0">
          {/* Logo */}
          <div className="text-center mb-8 slide-up">
            <div className="flex justify-center mb-5">
              <div
                className="w-24 h-24 rounded-2xl p-2 flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 0 40px rgba(59,130,246,0.15)",
                }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}logo.png`}
                  alt="لۆگۆ"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-xl font-extrabold text-white" style={ku}>
              بەڕێوەبەرێتی پەروەردەی شارباژێڕ
            </h1>
            <p className="text-base font-bold mt-1" style={{ ...ku, color: "#60a5fa", letterSpacing: "0.1em" }}>
              E-Diwan
            </p>
          </div>

          {/* Glass card */}
          <div
            className="rounded-2xl p-7 slide-up"
            style={{
              animationDelay: "80ms",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <h2 className="text-base font-bold text-white mb-6 text-center" style={ku}>
              چوونەژوورەوە
            </h2>

            {error && (
              <div
                className="mb-5 rounded-xl px-4 py-3 text-sm flex items-center gap-2 slide-up"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#fca5a5",
                  fontFamily: "'Noto Kufi Arabic', sans-serif",
                }}
              >
                <span className="text-red-400">⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ ...ku, color: "rgba(148,163,184,0.8)" }}>
                  ناوی بەکارهێنەر
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused("user")}
                  onBlur={() => setFocused(null)}
                  required
                  autoComplete="username"
                  placeholder="ناوی بەکارهێنەرەکەت بنووسە"
                  className="w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200"
                  style={{
                    fontFamily: "'Noto Kufi Arabic', sans-serif",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${focused === "user" ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: focused === "user" ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
                    color: "white",
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ ...ku, color: "rgba(148,163,184,0.8)" }}>
                  ووشەی نهێنی
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("pass")}
                  onBlur={() => setFocused(null)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${focused === "pass" ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: focused === "pass" ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
                    color: "white",
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full rounded-xl py-3 text-sm font-bold text-white overflow-hidden transition-all duration-200 mt-2"
                style={{
                  background: loading
                    ? "rgba(59,130,246,0.4)"
                    : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: loading ? "none" : "0 0 20px rgba(59,130,246,0.4), 0 4px 14px rgba(0,0,0,0.3)",
                  fontFamily: "'Noto Kufi Arabic', sans-serif",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    چاوەڕێ بکە...
                  </span>
                ) : (
                  "چوونەژوورەوە →"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs mt-5" style={{ color: "rgba(71,85,105,0.8)" }}>
            E-Diwan &copy; {new Date().getFullYear()} — بەڕێوەبەرێتی پەروەردەی شارباژێڕ
          </p>
        </div>
      </div>
    </div>
  );
}
