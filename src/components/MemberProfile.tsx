import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Award,
} from "lucide-react";

interface MemberProfileProps {
  user: {
    email: string;
    name: string;
    role: string;
  };
}

export default function MemberProfile({
  user,
}: MemberProfileProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <User className="size-6 text-orange-500" />
            </div>
            <div>
              <CardTitle>Member Profile</CardTitle>
              <CardDescription>
                View and manage your account information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user.email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  defaultValue="1995-06-15"
                />
              </div>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <CardTitle>Membership Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Award className="size-5 text-orange-500 mt-1" />
              <div>
                <p className="text-slate-600">Plan</p>
                <p>Premium</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="size-5 text-orange-500 mt-1" />
              <div>
                <p className="text-slate-600">Start Date</p>
                <p>Jan 1, 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="size-5 text-orange-500 mt-1" />
              <div>
                <p className="text-slate-600">Expires</p>
                <p>Dec 31, 2025</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <CardTitle>Fitness Stats</CardTitle>
          <CardDescription>
            Your progress over time
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-slate-900">42</p>
              <p className="text-slate-600">Total Workouts</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-slate-900">18h 30m</p>
              <p className="text-slate-600">Total Time</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-slate-900">12</p>
              <p className="text-slate-600">Classes Attended</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-slate-900">7</p>
              <p className="text-slate-600">Current Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}