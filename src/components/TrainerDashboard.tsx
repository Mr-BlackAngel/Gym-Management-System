// src/components/TrainerDashboard.tsx
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dumbbell,
  LogOut,
  Users,
  Calendar,
  User,
  Clock,
  MapPin,
  Mail,
  Phone,
  Activity,
} from "lucide-react";
import BMICalculator from "./BMICalculator";
import ExerciseRandomizer from "./ExerciseRandomizer";

/**
 * Rewritten Trainer Dashboard
 * - Dark-background dialogs / selects are NOT forced globally here.
 * - Uses clear non-transparent card backgrounds so text contrast is reliable.
 * - Matches Admin/Member visual language: royal-blue accents + orange highlights.
 * - Fully self-contained view (expects existing UI primitives in /components/ui/*).
 */

interface TrainerDashboardProps {
  user: {
    email: string;
    name: string;
    role: string;
  };
  onLogout: () => void;
}

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  goal: string;
  sessions: number;
  progress: number;
  lastSession: string;
  nextSession: string;
};

const clientsData: Client[] = [
  {
    id: 1,
    name: "Rahul Verma",
    email: "rahul.verma@gmail.com",
    phone: "+91 98765 43210",
    goal: "Weight Loss",
    sessions: 8,
    progress: 75,
    lastSession: "Yesterday",
    nextSession: "Tomorrow, 6:00 AM",
  },
  {
    id: 2,
    name: "Arjun Mehta",
    email: "arjun.mehta@gmail.com",
    phone: "+91 97654 32109",
    goal: "Muscle Gain",
    sessions: 12,
    progress: 60,
    lastSession: "2 days ago",
    nextSession: "Tomorrow, 7:00 PM",
  },
  {
    id: 3,
    name: "Sneha Reddy",
    email: "sneha.reddy@gmail.com",
    phone: "+91 96543 21098",
    goal: "Endurance",
    sessions: 15,
    progress: 85,
    lastSession: "Today",
    nextSession: "Today, 5:00 PM",
  },
  {
    id: 4,
    name: "Karthik Iyer",
    email: "karthik.iyer@gmail.com",
    phone: "+91 95432 10987",
    goal: "Strength",
    sessions: 10,
    progress: 50,
    lastSession: "3 days ago",
    nextSession: "Nov 13, 6:00 PM",
  },
  {
    id: 5,
    name: "Priya Kapoor",
    email: "priya.k@gmail.com",
    phone: "+91 98123 45678",
    goal: "Flexibility",
    sessions: 6,
    progress: 70,
    lastSession: "Yesterday",
    nextSession: "Nov 14, 7:00 AM",
  },
];

const weeklySchedule = [
  {
    day: "Monday",
    date: "Nov 11",
    sessions: [
      { time: "6:00 AM - 7:00 AM", type: "Personal Training", client: "Rahul Verma", location: "Training Room 1" },
      { time: "7:00 AM - 8:00 AM", type: "Group Class", client: "HIIT Training", participants: 12, location: "Studio A" },
      { time: "5:00 PM - 6:00 PM", type: "Personal Training", client: "Sneha Reddy", location: "Training Room 2" },
      { time: "6:30 PM - 7:30 PM", type: "Group Class", client: "Boxing Cardio", participants: 10, location: "Studio B" },
    ],
  },
  {
    day: "Tuesday",
    date: "Nov 12",
    sessions: [
      { time: "7:00 AM - 8:00 AM", type: "Group Class", client: "HIIT Training", participants: 11, location: "Studio A" },
      { time: "6:00 PM - 7:00 PM", type: "Personal Training", client: "Karthik Iyer", location: "Training Room 1" },
      { time: "7:00 PM - 8:00 PM", type: "Personal Training", client: "Arjun Mehta", location: "Training Room 2" },
    ],
  },
  // ... remainder of week (keep same structure)
];

const groupClasses = [
  {
    id: 1,
    name: "HIIT Training",
    schedule: "Mon, Wed, Fri - 7:00 AM",
    enrolledMembers: [
      { name: "Anjali Sharma", email: "anjali.sharma@gmail.com", joined: "Jan 2025" },
      { name: "Rohan Patel", email: "rohan.patel@gmail.com", joined: "Feb 2025" },
      { name: "Divya Nair", email: "divya.nair@gmail.com", joined: "Mar 2025" },
      { name: "Karthik Iyer", email: "karthik.iyer@gmail.com", joined: "Dec 2024" },
      { name: "Priya Kapoor", email: "priya.k@gmail.com", joined: "Feb 2025" },
      { name: "Rahul Verma", email: "rahul.verma@gmail.com", joined: "Jan 2025" },
      { name: "Arjun Mehta", email: "arjun.mehta@gmail.com", joined: "Mar 2025" },
      { name: "Sneha Reddy", email: "sneha.reddy@gmail.com", joined: "Jan 2025" },
    ],
  },
  {
    id: 2,
    name: "Boxing Cardio",
    schedule: "Mon, Thu - 6:30 PM",
    enrolledMembers: [
      { name: "Rohan Patel", email: "rohan.patel@gmail.com", joined: "Feb 2025" },
      { name: "Karthik Iyer", email: "karthik.iyer@gmail.com", joined: "Dec 2024" },
      { name: "Arjun Mehta", email: "arjun.mehta@gmail.com", joined: "Mar 2025" },
      { name: "Rahul Verma", email: "rahul.verma@gmail.com", joined: "Jan 2025" },
    ],
  },
];

export default function TrainerDashboard({ user, onLogout }: TrainerDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const clients = clientsData;

  const totalSessionsThisWeek = weeklySchedule.reduce((acc, day) => acc + day.sessions.length, 0);
  const totalGroupClasses = groupClasses.length;
  const averageRating = 4.9;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-b border-slate-700 sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Dumbbell className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-white text-lg font-semibold">AKHADA - Trainer Portal</h1>
                <p className="text-slate-300 text-sm">Welcome, {user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-sm text-white/90">Signed in as</div>
                <div className="text-sm font-medium text-white">{user.email}</div>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900"
              >
                <LogOut className="mr-2 size-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
          <TabsList className="grid grid-cols-5 gap-2 max-w-3xl mx-auto mb-8 bg-white rounded-lg shadow-sm p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md">
              Overview
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md">
              My Clients
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md">
              Group Classes
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md">
              Tools
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="flex items-center justify-between pb-0">
                  <CardTitle className="text-slate-900 text-sm font-medium">Active Clients</CardTitle>
                  <Users className="size-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-slate-900">{clients.length}</div>
                  <p className="text-sm text-slate-500">Personal training</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="flex items-center justify-between pb-0">
                  <CardTitle className="text-slate-900 text-sm font-medium">This Week</CardTitle>
                  <Calendar className="size-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-slate-900">{totalSessionsThisWeek}</div>
                  <p className="text-sm text-slate-500">scheduled sessions</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="flex items-center justify-between pb-0">
                  <CardTitle className="text-slate-900 text-sm font-medium">Group Classes</CardTitle>
                  <Dumbbell className="size-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-slate-900">{totalGroupClasses}</div>
                  <p className="text-sm text-slate-500">active classes</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="flex items-center justify-between pb-0">
                  <CardTitle className="text-slate-900 text-sm font-medium">Rating</CardTitle>
                  <User className="size-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-slate-900">{averageRating} ⭐</div>
                  <p className="text-sm text-slate-500">from recent feedback</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-slate-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="text-slate-900">Today's Sessions</CardTitle>
                  <CardDescription>Your schedule for today</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {weeklySchedule[0].sessions.map((session, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                        <div className="p-2 bg-orange-50 rounded-md">
                          <Clock className="size-5 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{session.time}</p>
                          <p className="text-sm text-slate-600">{session.client}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="size-3" />
                            {session.location}
                          </p>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-sm ${session.type === "Group Class" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                            {session.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-slate-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="text-slate-900">Upcoming Clients</CardTitle>
                  <CardDescription>Next sessions scheduled</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {clients.slice(0, 4).map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-medium text-slate-900">{client.name}</p>
                          <p className="text-sm text-slate-600">{client.nextSession}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setSelectedClient(client)}>
                          View
                        </Button>
                      </div>
                    ))}
                    {selectedClient && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg border">
                        <p className="font-medium">{selectedClient.name}</p>
                        <p className="text-sm text-slate-600">{selectedClient.email} • {selectedClient.phone}</p>
                        <div className="mt-2">
                          <p className="text-sm text-slate-600">Goal: <span className="font-medium text-slate-900">{selectedClient.goal}</span></p>
                          <p className="text-sm text-slate-600">Progress: <span className="font-medium">{selectedClient.progress}%</span></p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Clients */}
          <TabsContent value="clients">
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Users className="size-6 text-orange-500" />
                  My Clients ({clients.length})
                </CardTitle>
                <CardDescription>Manage your personal training clients</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clients.map((client) => (
                    <Card key={client.id} className="border rounded-lg">
                      <CardHeader className="bg-gradient-to-r from-orange-50 to-white rounded-t-lg">
                        <div className="flex items-start justify-between w-full">
                          <div>
                            <CardTitle className="text-slate-900">{client.name}</CardTitle>
                            <CardDescription>Goal: {client.goal}</CardDescription>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-slate-600">{client.sessions} sessions</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="size-4 text-slate-500" />
                            <div>
                              <div className="text-sm text-slate-600">{client.email}</div>
                              <div className="text-sm text-slate-600">{client.phone}</div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-600">Progress:</span>
                              <span className="font-medium">{client.progress}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full">
                              <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{ width: `${client.progress}%` }} />
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100">
                            <p className="text-sm text-slate-600">Last: <span className="font-medium text-slate-900">{client.lastSession}</span></p>
                            <p className="text-sm text-slate-600">Next: <span className="font-medium text-orange-600">{client.nextSession}</span></p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="schedule">
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Calendar className="size-6 text-orange-500" />
                  Weekly Schedule
                </CardTitle>
                <CardDescription>Your complete schedule for this week</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {weeklySchedule.map((day, idx) => (
                    <div key={idx} className="border-l-4 border-orange-500 pl-4">
                      <div className="mb-3">
                        <h3 className="text-slate-900 font-semibold">{day.day}</h3>
                        <p className="text-sm text-slate-600">{day.date}, 2025</p>
                      </div>
                      <div className="space-y-3">
                        {day.sessions.map((session, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-4 p-4 bg-white rounded-lg border">
                            <div className="w-32">
                              <p className="font-medium text-slate-900">{session.time}</p>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-3 py-1 rounded-full text-sm ${"participants" in session ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                  {session.type}
                                </span>
                                {"participants" in session && <span className="text-sm text-slate-600">({(session as any).participants} members)</span>}
                              </div>
                              <p className="font-medium text-slate-900">{session.client}</p>
                              <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                                <MapPin className="size-3" />
                                {session.location}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes */}
          <TabsContent value="classes">
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Dumbbell className="size-6 text-orange-500" />
                  My Group Classes
                </CardTitle>
                <CardDescription>Classes you teach and enrolled members</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {groupClasses.map((c) => (
                    <Card key={c.id} className="border rounded-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-slate-900">{c.name}</CardTitle>
                            <CardDescription>{c.schedule}</CardDescription>
                          </div>
                          <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-700">{c.enrolledMembers.length} enrolled</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-medium text-slate-900 mb-3">Enrolled Members:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {c.enrolledMembers.map((m, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                              <div className="bg-orange-100 p-2 rounded-full">
                                <User className="size-4 text-orange-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{m.name}</p>
                                <p className="text-sm text-slate-600">{m.email}</p>
                                <p className="text-xs text-slate-500">Joined: {m.joined}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools */}
          <TabsContent value="tools">
            <div className="space-y-6">
              <Card className="shadow-lg border-slate-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="text-slate-900">Tools</CardTitle>
                  <CardDescription>Handy utilities for trainers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <BMICalculator />
                    </div>
                    <div>
                      <ExerciseRandomizer />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
