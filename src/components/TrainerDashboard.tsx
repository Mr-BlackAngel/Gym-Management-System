import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dumbbell, LogOut, Users, Calendar, CheckCircle, User, Clock, MapPin, Mail, Phone } from 'lucide-react';
import { Badge } from './ui/badge';
import BMICalculator from './BMICalculator';
import ExerciseRandomizer from "./ExerciseRandomizer";


interface TrainerDashboardProps {
  user: {
    email: string;
    name: string;
    role: string;
  };
  onLogout: () => void;
}

const clients = [
  { 
    id: 1, 
    name: 'Rahul Verma', 
    email: 'rahul.verma@gmail.com',
    phone: '+91 98765 43210',
    goal: 'Weight Loss', 
    sessions: 8, 
    progress: 75, 
    lastSession: 'Yesterday',
    nextSession: 'Tomorrow, 6:00 AM'
  },
  { 
    id: 2, 
    name: 'Arjun Mehta', 
    email: 'arjun.mehta@gmail.com',
    phone: '+91 97654 32109',
    goal: 'Muscle Gain', 
    sessions: 12, 
    progress: 60, 
    lastSession: '2 days ago',
    nextSession: 'Tomorrow, 7:00 PM'
  },
  { 
    id: 3, 
    name: 'Sneha Reddy', 
    email: 'sneha.reddy@gmail.com',
    phone: '+91 96543 21098',
    goal: 'Endurance', 
    sessions: 15, 
    progress: 85, 
    lastSession: 'Today',
    nextSession: 'Today, 5:00 PM'
  },
  { 
    id: 4, 
    name: 'Karthik Iyer', 
    email: 'karthik.iyer@gmail.com',
    phone: '+91 95432 10987',
    goal: 'Strength', 
    sessions: 10, 
    progress: 50, 
    lastSession: '3 days ago',
    nextSession: 'Nov 13, 6:00 PM'
  },
  { 
    id: 5, 
    name: 'Priya Kapoor', 
    email: 'priya.k@gmail.com',
    phone: '+91 98123 45678',
    goal: 'Flexibility', 
    sessions: 6, 
    progress: 70, 
    lastSession: 'Yesterday',
    nextSession: 'Nov 14, 7:00 AM'
  },
];

const weeklySchedule = [
  {
    day: 'Monday',
    date: 'Nov 11',
    sessions: [
      { time: '6:00 AM - 7:00 AM', type: 'Personal Training', client: 'Rahul Verma', location: 'Training Room 1' },
      { time: '7:00 AM - 8:00 AM', type: 'Group Class', client: 'HIIT Training', participants: 12, location: 'Studio A' },
      { time: '5:00 PM - 6:00 PM', type: 'Personal Training', client: 'Sneha Reddy', location: 'Training Room 2' },
      { time: '6:30 PM - 7:30 PM', type: 'Group Class', client: 'Boxing Cardio', participants: 10, location: 'Studio B' },
    ]
  },
  {
    day: 'Tuesday',
    date: 'Nov 12',
    sessions: [
      { time: '7:00 AM - 8:00 AM', type: 'Group Class', client: 'HIIT Training', participants: 11, location: 'Studio A' },
      { time: '6:00 PM - 7:00 PM', type: 'Personal Training', client: 'Karthik Iyer', location: 'Training Room 1' },
      { time: '7:00 PM - 8:00 PM', type: 'Personal Training', client: 'Arjun Mehta', location: 'Training Room 2' },
    ]
  },
  {
    day: 'Wednesday',
    date: 'Nov 13',
    sessions: [
      { time: '6:00 AM - 7:00 AM', type: 'Personal Training', client: 'Rahul Verma', location: 'Training Room 1' },
      { time: '7:00 AM - 8:00 AM', type: 'Group Class', client: 'HIIT Training', participants: 13, location: 'Studio A' },
      { time: '5:00 PM - 6:00 PM', type: 'Personal Training', client: 'Sneha Reddy', location: 'Training Room 2' },
    ]
  },
  {
    day: 'Thursday',
    date: 'Nov 14',
    sessions: [
      { time: '7:00 AM - 8:00 AM', type: 'Personal Training', client: 'Priya Kapoor', location: 'Training Room 1' },
      { time: '6:30 PM - 7:30 PM', type: 'Group Class', client: 'Boxing Cardio', participants: 9, location: 'Studio B' },
      { time: '7:00 PM - 8:00 PM', type: 'Personal Training', client: 'Arjun Mehta', location: 'Training Room 2' },
    ]
  },
  {
    day: 'Friday',
    date: 'Nov 15',
    sessions: [
      { time: '6:00 AM - 7:00 AM', type: 'Personal Training', client: 'Rahul Verma', location: 'Training Room 1' },
      { time: '7:00 AM - 8:00 AM', type: 'Group Class', client: 'HIIT Training', participants: 14, location: 'Studio A' },
      { time: '5:00 PM - 6:00 PM', type: 'Personal Training', client: 'Sneha Reddy', location: 'Training Room 2' },
    ]
  },
  {
    day: 'Saturday',
    date: 'Nov 16',
    sessions: [
      { time: '8:00 AM - 9:00 AM', type: 'Group Class', client: 'HIIT Training', participants: 15, location: 'Studio A' },
      { time: '10:00 AM - 11:00 AM', type: 'Personal Training', client: 'Karthik Iyer', location: 'Training Room 1' },
    ]
  },
  {
    day: 'Sunday',
    date: 'Nov 17',
    sessions: [
      { time: '9:00 AM - 10:00 AM', type: 'Group Class', client: 'Recovery Yoga', participants: 8, location: 'Studio A' },
    ]
  },
];

const groupClasses = [
  {
    id: 1,
    name: 'HIIT Training',
    schedule: 'Mon, Wed, Fri - 7:00 AM',
    enrolledMembers: [
      { name: 'Anjali Sharma', email: 'anjali.sharma@gmail.com', joined: 'Jan 2025' },
      { name: 'Rohan Patel', email: 'rohan.patel@gmail.com', joined: 'Feb 2025' },
      { name: 'Divya Nair', email: 'divya.nair@gmail.com', joined: 'Mar 2025' },
      { name: 'Karthik Iyer', email: 'karthik.iyer@gmail.com', joined: 'Dec 2024' },
      { name: 'Priya Kapoor', email: 'priya.k@gmail.com', joined: 'Feb 2025' },
      { name: 'Rahul Verma', email: 'rahul.verma@gmail.com', joined: 'Jan 2025' },
      { name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', joined: 'Mar 2025' },
      { name: 'Sneha Reddy', email: 'sneha.reddy@gmail.com', joined: 'Jan 2025' },
    ]
  },
  {
    id: 2,
    name: 'Boxing Cardio',
    schedule: 'Mon, Thu - 6:30 PM',
    enrolledMembers: [
      { name: 'Rohan Patel', email: 'rohan.patel@gmail.com', joined: 'Feb 2025' },
      { name: 'Karthik Iyer', email: 'karthik.iyer@gmail.com', joined: 'Dec 2024' },
      { name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', joined: 'Mar 2025' },
      { name: 'Rahul Verma', email: 'rahul.verma@gmail.com', joined: 'Jan 2025' },
    ]
  },
];

export default function TrainerDashboard({ user, onLogout }: TrainerDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);

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
                <h1 className="text-white">AKHADA - Trainer Portal</h1>
                <p className="text-slate-300">Welcome, {user.name}</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto mb-8 bg-white shadow-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              My Clients
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Group Classes
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white">Active Clients</CardTitle>
                  <Users className="size-5 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-white">{clients.length}</div>
                  <p className="text-white/80">Personal training</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white">This Week</CardTitle>
                  <Calendar className="size-5 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-white">{weeklySchedule.reduce((sum, day) => sum + day.sessions.length, 0)} sessions</div>
                  <p className="text-white/80">Across 7 days</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white">Group Classes</CardTitle>
                  <Dumbbell className="size-5 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-white">{groupClasses.length} active</div>
                  <p className="text-white/80">{groupClasses.reduce((sum, c) => sum + c.enrolledMembers.length, 0)} total members</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white">Rating</CardTitle>
                  <User className="size-5 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-white">4.9 ⭐</div>
                  <p className="text-white/80">Based on 28 reviews</p>
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
                      <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <Clock className="size-5 text-orange-500 mt-1" />
                        <div className="flex-1">
                          <p className="font-medium">{session.time}</p>
                          <p className="text-slate-600">{session.client}</p>
                          <p className="text-slate-500">{session.location}</p>
                        </div>
                        <Badge className={session.type === 'Group Class' ? 'bg-purple-500' : 'bg-blue-500'}>
                          {session.type}
                        </Badge>
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
                      <div key={client.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-slate-600">{client.nextSession}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setSelectedClient(client)}>
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
                    <Card key={client.id} className="border-2 border-slate-200 hover:border-orange-300 transition-colors">
                      <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-slate-900">{client.name}</CardTitle>
                            <CardDescription>Goal: {client.goal}</CardDescription>
                          </div>
                          <Badge className="bg-orange-500">{client.sessions} sessions</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="size-4 text-slate-500" />
                            <p className="text-slate-600">{client.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="size-4 text-slate-500" />
                            <p className="text-slate-600">{client.phone}</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-600">Progress:</span>
                            <span className="font-medium">{client.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full">
                            <div 
                              className="h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" 
                              style={{ width: `${client.progress}%` }} 
                            />
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-200 space-y-1">
                          <p className="text-slate-600">Last Session: <span className="font-medium">{client.lastSession}</span></p>
                          <p className="text-slate-600">Next Session: <span className="font-medium text-orange-600">{client.nextSession}</span></p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                        <h3 className="text-slate-900">{day.day}</h3>
                        <p className="text-slate-600">{day.date}, 2025</p>
                      </div>
                      <div className="space-y-3">
                        {day.sessions.map((session, sessionIdx) => (
                          <div key={sessionIdx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-orange-50 transition-colors">
                            <div className="flex-shrink-0 w-32">
                              <p className="font-medium text-slate-900">{session.time}</p>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={session.type === 'Group Class' ? 'bg-purple-500' : 'bg-blue-500'}>
                                  {session.type}
                                </Badge>
                                {'participants' in session && (
                                  <span className="text-slate-600">({session.participants} members)</span>
                                )}
                              </div>
                              <p className="font-medium text-slate-900">{session.client}</p>
                              <p className="text-slate-600 flex items-center gap-1 mt-1">
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
                  {groupClasses.map((classItem) => (
                    <Card key={classItem.id} className="border-2 border-orange-200 bg-gradient-to-r from-white to-orange-50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-slate-900">{classItem.name}</CardTitle>
                            <CardDescription>{classItem.schedule}</CardDescription>
                          </div>
                          <Badge className="bg-orange-500">
                            {classItem.enrolledMembers.length} enrolled
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-medium text-slate-900 mb-3">Enrolled Members:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {classItem.enrolledMembers.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                              <div className="bg-orange-100 p-2 rounded-full">
                                <User className="size-4 text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">{member.name}</p>
                                <p className="text-slate-600">{member.email}</p>
                                <p className="text-slate-500">Joined: {member.joined}</p>
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

          <TabsContent value="tools">
            <div className="space-y-6">
              <BMICalculator />
              <ExerciseRandomizer />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}