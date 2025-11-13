import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <Card className="w-[380px] shadow-xl">
        <CardContent className="p-6 space-y-5">
          <div className="text-center mb-2">
            <h1 className="text-3xl font-bold text-red-600 tracking-wide">
              AKHADA
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Gym Management System
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
          </div>

          <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-4">
            Login
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            New here?{" "}
            <a href="#" className="text-red-600 hover:underline">
              Create an account
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
