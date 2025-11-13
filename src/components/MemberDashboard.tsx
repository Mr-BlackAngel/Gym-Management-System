import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dumbbell, LogOut, Calculator, Activity, Calendar, User } from 'lucide-react';
import BMICalculator from './BMICalculator';
import ExerciseRandomizer from "./ExerciseRandomizer";
import MemberProfile from './MemberProfile';
import ClassBooking from './ClassBooking';

interface MemberDashboardProps {
  user: {
    email: string;
    name: string;
    role: string;
  };
  onLogout: () => void;
}

export default function MemberDashboard({ user, onLogout }: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="size-8 text-orange-500" />
              <div>
                <h1 className="text-slate-900">AKHADA</h1>
                <p className="text-slate-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline">
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Workouts</CardTitle>
                  <Activity className="size-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-slate-900">12 this month</div>
                  <p className="text-slate-600">+3 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Classes Booked</CardTitle>
                  <Calendar className="size-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-slate-900">5 upcoming</div>
                  <p className="text-slate-600">Next: Tomorrow 6 AM</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Current Streak</CardTitle>
                  <Dumbbell className="size-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-slate-900">7 days</div>
                  <p className="text-slate-600">Keep it going!</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Membership</CardTitle>
                  <User className="size-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-slate-900">Premium</div>
                  <p className="text-slate-600">Expires Dec 2025</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Access your fitness tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setActiveTab('health')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Calculator className="mr-2 size-4" />
                    Health Calculator
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('workout')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Dumbbell className="mr-2 size-4" />
                    Generate Workout
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('classes')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Calendar className="mr-2 size-4" />
                    Book a Class
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest workouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Push Day Workout</p>
                        <p className="text-slate-600">Yesterday, 6:30 PM</p>
                      </div>
                      <Badge className="bg-green-500">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Morning Yoga</p>
                        <p className="text-slate-600">2 days ago, 6:00 AM</p>
                      </div>
                      <Badge className="bg-green-500">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Leg Day Workout</p>
                        <p className="text-slate-600">3 days ago, 7:00 PM</p>
                      </div>
                      <Badge className="bg-green-500">Completed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health">
            <BMICalculator />
          </TabsContent>

          <TabsContent value="workout">
            <ExerciseRandomizer />
          </TabsContent>

          <TabsContent value="classes">
            <ClassBooking />
          </TabsContent>

          <TabsContent value="profile">
            <MemberProfile user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`px-2 py-1 rounded text-white ${className}`}>
      {children}
    </span>
  );
}
