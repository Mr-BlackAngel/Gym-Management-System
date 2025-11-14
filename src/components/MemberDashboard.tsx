import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dumbbell,
  LogOut,
  Calculator,
  Activity,
  Calendar,
  User,
} from "lucide-react";
import BMICalculator from "./BMICalculator";
import ExerciseRandomizer from "./ExerciseRandomizer";
import MemberProfile from "./MemberProfile";
import ClassBooking from "./ClassBooking";

// Local badge override
function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`px-2 py-1 rounded text-white text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

interface MemberDashboardProps {
  user: {
    email: string;
    name: string;
    role: string;
  };
  onLogout: () => void;
}

export default function MemberDashboard({
  user,
  onLogout,
}: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-b border-slate-700 sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-2 rounded-lg shadow-md">
                <Dumbbell className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">AKHADA</h1>
                <p className="text-slate-300 text-sm">
                  Welcome back, {user.name}
                </p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 transition"
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto mb-8 bg-white shadow-md rounded-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* =======================
           ▼ OVERVIEW TAB
          ======================= */}
          <TabsContent value="overview">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-white">Workouts</CardTitle>
                  <Activity className="size-4 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-white/80">+3 from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-white">Classes Booked</CardTitle>
                  <Calendar className="size-4 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-white/80">Next: Tomorrow</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-white">Current Streak</CardTitle>
                  <Dumbbell className="size-4 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7 days</div>
                  <p className="text-white/80">Keep it going!</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-white">Membership</CardTitle>
                  <User className="size-4 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">Premium</div>
                  <p className="text-white/80">Expires Dec 2025</p>
                </CardContent>
              </Card>
            </div>

            {/* Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="border border-slate-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white rounded-t-md">
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Access your fitness tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  <Button
                    onClick={() => setActiveTab("health")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Calculator className="mr-2 size-4" />
                    Health Calculator
                  </Button>
                  <Button
                    onClick={() => setActiveTab("workout")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Dumbbell className="mr-2 size-4" />
                    Generate Workout
                  </Button>
                  <Button
                    onClick={() => setActiveTab("classes")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Calendar className="mr-2 size-4" />
                    Book a Class
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border border-slate-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white rounded-t-md">
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your last sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {[
                    {
                      title: "Push Day Workout",
                      time: "Yesterday",
                    },
                    {
                      title: "Morning Yoga",
                      time: "2 days ago",
                    },
                    {
                      title: "Leg Day Workout",
                      time: "3 days ago",
                    },
                  ].map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{a.title}</p>
                        <p className="text-slate-600 text-sm">{a.time}</p>
                      </div>
                      <Badge className="bg-green-600">Completed</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* =======================
           ▼ HEALTH
          ======================= */}
          <TabsContent value="health">
            <BMICalculator />
          </TabsContent>

          {/* =======================
           ▼ WORKOUT
          ======================= */}
          <TabsContent value="workout">
            <ExerciseRandomizer />
          </TabsContent>

          {/* =======================
           ▼ CLASS BOOKING
          ======================= */}
          <TabsContent value="classes">
            <ClassBooking />
          </TabsContent>

          {/* =======================
           ▼ PROFILE
          ======================= */}
          <TabsContent value="profile">
            <MemberProfile user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
