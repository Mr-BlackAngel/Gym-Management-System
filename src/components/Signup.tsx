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
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, UserPlus } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Signup({ onBackToLogin }: { onBackToLogin: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    age: "",
    address: "",
    plan: "Basic",
  });

  const updateField = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required.");
      setLoading(false);
      return;
    }

    try {
      const joined = new Date();
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1); // 1-month membership

      const { error } = await supabase.from("members").insert([
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          gender: form.gender,
          age: form.age ? Number(form.age) : null,
          address: form.address,
          plan: form.plan,
          status: "Active",
          joined_date: joined.toISOString().split("T")[0],
          expiry_date: expiry.toISOString().split("T")[0],
        },
      ]);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      alert("Account created! You can now log in.");
      onBackToLogin();
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b0f19] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-black" />

      {/* Background image */}
      <div
        className="
        absolute inset-0 
        opacity-[0.12] 
        bg-[url('/login-bg.jpg')] 
        bg-cover bg-center 
        mix-blend-screen 
      "
      />

      <div className="relative w-full max-w-lg px-4 z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 text-white">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-orange-500 p-4 rounded-full shadow-lg">
              <UserPlus className="size-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold mt-4 tracking-tight">
              Join AKHADA
            </h1>
            <p className="text-white/70 text-center">Create your membership</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Inputs list */}
            {[
              ["name", "Full Name"],
              ["email", "Email"],
              ["password", "Password"],
              ["phone", "Phone Number"],
              ["age", "Age"],
              ["address", "Address"],
            ].map(([field, label]) => (
              <div key={field} className="space-y-2">
                <Label>{label}</Label>
                <Input
                  type={field === "password" ? "password" : "text"}
                  className="bg-white/10 border-white/20 text-white placeholder-white/40"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  onChange={(e) => updateField(field, e.target.value)}
                />
              </div>
            ))}

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select onValueChange={(v) => updateField("gender", v)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Plan */}
            <div className="space-y-2">
              <Label>Membership Plan</Label>
              <Select
                value={form.plan}
                onValueChange={(v) => updateField("plan", v)}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Signup button */}
            <Button
              onClick={handleSignup}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg py-3 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Back to login */}
            <button
              onClick={onBackToLogin}
              className="block mx-auto text-white/70 hover:text-white hover:underline mt-4"
            >
              ← Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
