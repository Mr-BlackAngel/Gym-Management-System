import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { Dumbbell, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

interface LoginPageProps {
  onLogin: (
    user: { email: string; role: "admin" | "trainer" | "member"; name: string },
    rememberMe: boolean
  ) => void;
  onBackToGuest: () => void;
}

export default function LoginPage({ onLogin, onBackToGuest }: LoginPageProps) {
  const [role, setRole] = useState<"admin" | "trainer" | "member">("member");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const table = role === "trainer" ? "trainers" : "members";

      const { data, error: fetchError } = await supabase
        .from(table)
        .select("id, name, email, password")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (fetchError || !data) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      onLogin(
        {
          email: data.email,
          role,
          name: data.name,
        },
        rememberMe
      );
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b0f19] overflow-hidden">

      {/* Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-black" />

      {/* Gym Background Image */}
      <div
        className="
        absolute inset-0 
        opacity-[0.12] 
        bg-[url('/login-bg.jpg')] 
        bg-cover bg-center 
        mix-blend-screen 
        "
      />

      {/* LOGIN CARD */}
      <div className="relative w-full max-w-md px-4 z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 text-white">

          <div className="flex flex-col items-center mb-8">
            <div className="bg-orange-500 p-4 rounded-full shadow-lg">
              <Dumbbell className="size-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold mt-4 tracking-tight">
              Welcome to AKHADA
            </h1>
            <p className="text-white/70 text-center">
              Sign in to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Role */}
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as any)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                className="bg-white/10 border-white/20 text-white placeholder-white/40"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                className="bg-white/10 border-white/20 text-white placeholder-white/40"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="cursor-pointer">
                  Remember me
                </Label>
              </div>
              <button type="button" className="text-orange-400 hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg py-3 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70">
              Don’t have an account?{" "}
              <span className="text-orange-400 hover:underline cursor-pointer">
                Sign Up
              </span>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onBackToGuest}
              className="text-white/60 hover:text-white hover:underline"
            >
              Back to Guest Portal
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
