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
      // Which table to check?
      const table =
        role === "trainer"
          ? "trainers"
          : "members"; // admin also stored inside members

      const { data, error: fetchError } = await supabase
        .from(table)
        .select("id, name, email, password")
        .eq("email", email)
        .eq("password", password) // plain text password match
        .single();

      if (fetchError || !data) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      // SUCCESS
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-orange-500 p-3 rounded-full mb-4">
              <Dumbbell className="size-8 text-white" />
            </div>
            <h1 className="text-slate-900">Welcome to AKHADA</h1>
            <p className="text-slate-600 text-center">Sign in to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as any)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

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
              <button type="button" className="text-orange-500 hover:underline">
                Forgot Password?
              </button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
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
            <p className="text-slate-600">
              Don't have an account?{" "}
              <button className="text-orange-500 hover:underline">Sign Up</button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onBackToGuest}
              className="text-slate-500 hover:text-slate-700 hover:underline"
            >
              Back to Guest Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
