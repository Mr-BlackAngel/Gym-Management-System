import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dumbbell, LogOut, Users, DollarSign, TrendingUp, User, Settings, Search, Filter, Download, Plus, Edit, Trash2, Phone, Mail, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AdminDashboardProps {
  user: {
    email: string;
    name: string;
    role: string;
  };
  onLogout: () => void;
}

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: string;
  joined: string;
  expiry: string;
  age: number;
  gender: string;
  address: string;
}

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  certification: string;
  clients: number;
  rating: number;
  salary: string;
  joined: string;
  password?: string;
}

const initialMembers: Member[] = [
  { 
    id: 1, 
    name: 'Rahul Verma', 
    email: 'rahul.verma@gmail.com', 
    phone: '+91 98765 43210',
    plan: 'Premium', 
    status: 'Active', 
    joined: 'Jan 15, 2025',
    expiry: 'Jan 15, 2026',
    age: 28,
    gender: 'Male',
    address: 'Mumbai, Maharashtra'
  },
  { 
    id: 2, 
    name: 'Priya Kapoor', 
    email: 'priya.k@gmail.com', 
    phone: '+91 98123 45678',
    plan: 'VIP', 
    status: 'Active', 
    joined: 'Feb 10, 2025',
    expiry: 'Feb 10, 2026',
    age: 25,
    gender: 'Female',
    address: 'Delhi, Delhi'
  },
  { 
    id: 3, 
    name: 'Arjun Mehta', 
    email: 'arjun.mehta@gmail.com', 
    phone: '+91 97654 32109',
    plan: 'Basic', 
    status: 'Active', 
    joined: 'Mar 5, 2025',
    expiry: 'Mar 5, 2026',
    age: 32,
    gender: 'Male',
    address: 'Bangalore, Karnataka'
  },
];

const initialTrainers: Trainer[] = [
  { 
    id: 1, 
    name: 'Vikram Singh', 
    email: 'vikram.singh@gym.akhada',
    phone: '+91 98888 12345',
    specialization: 'Strength & Conditioning', 
    experience: '8 years',
    certification: 'ACE Certified',
    clients: 12,
    rating: 4.9,
    salary: '₹65,000',
    joined: 'Jan 2022',
    password: 'Trainer@12345'
  },
  { 
    id: 2, 
    name: 'Priya Sharma', 
    email: 'priya.sharma@gym.akhada',
    phone: '+91 98777 23456',
    specialization: 'Yoga & Flexibility', 
    experience: '6 years',
    certification: 'RYT 500',
    clients: 18,
    rating: 4.8,
    salary: '₹55,000',
    joined: 'Jun 2022',
    password: 'Trainer@12345'
  },
];

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [isAddTrainerOpen, setIsAddTrainerOpen] = useState(false);
  const [isEditTrainerOpen, setIsEditTrainerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  // Member form state
  const [memberForm, setMemberForm] = useState<Partial<Member>>({
    name: '',
    email: '',
    phone: '',
    plan: 'Basic',
    status: 'Active',
    age: 25,
    gender: 'Male',
    address: '',
    joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  });

  // Trainer form state
  const [trainerForm, setTrainerForm] = useState<Partial<Trainer>>({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    certification: '',
    salary: '₹50,000',
    clients: 0,
    rating: 4.5,
    joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    password: 'Trainer@12345'
  });

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const filteredTrainers = trainers.filter(trainer => 
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add Member
  const handleAddMember = () => {
    const newMember: Member = {
      ...memberForm,
      id: Math.max(...members.map(m => m.id), 0) + 1,
    } as Member;
    setMembers([...members, newMember]);
    setIsAddMemberOpen(false);
    resetMemberForm();
  };

  // Edit Member
  const handleEditMember = () => {
    if (!selectedMember) return;
    setMembers(members.map(m => m.id === selectedMember.id ? { ...selectedMember, ...memberForm } : m));
    setIsEditMemberOpen(false);
    setSelectedMember(null);
    resetMemberForm();
  };

  // Delete Member
  const handleDeleteMember = (id: number) => {
    if (confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  // Add Trainer
  const handleAddTrainer = () => {
    // Generate email from name if not provided
    let email = trainerForm.email;
    if (!email || !email.includes('@gym.akhada')) {
      const namePart = trainerForm.name?.toLowerCase().replace(/\s+/g, '.') || 'trainer';
      email = `${namePart}@gym.akhada`;
    }

    const newTrainer: Trainer = {
      ...trainerForm,
      email,
      id: Math.max(...trainers.map(t => t.id), 0) + 1,
    } as Trainer;
    setTrainers([...trainers, newTrainer]);
    setIsAddTrainerOpen(false);
    resetTrainerForm();
  };

  // Edit Trainer
  const handleEditTrainer = () => {
    if (!selectedTrainer) return;
    setTrainers(trainers.map(t => t.id === selectedTrainer.id ? { ...selectedTrainer, ...trainerForm } : t));
    setIsEditTrainerOpen(false);
    setSelectedTrainer(null);
    resetTrainerForm();
  };

  // Delete Trainer
  const handleDeleteTrainer = (id: number) => {
    if (confirm('Are you sure you want to delete this trainer?')) {
      setTrainers(trainers.filter(t => t.id !== id));
    }
  };

  const resetMemberForm = () => {
    setMemberForm({
      name: '',
      email: '',
      phone: '',
      plan: 'Basic',
      status: 'Active',
      age: 25,
      gender: 'Male',
      address: '',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
  };

  const resetTrainerForm = () => {
    setTrainerForm({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      experience: '',
      certification: '',
      salary: '₹50,000',
      clients: 0,
      rating: 4.5,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      password: 'Trainer@12345'
    });
  };

  const openEditMember = (member: Member) => {
    setSelectedMember(member);
    setMemberForm(member);
    setIsEditMemberOpen(true);
  };

  const openEditTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setTrainerForm(trainer);
    setIsEditTrainerOpen(true);
  };

  const activeMembers = members.filter(m => m.status === 'Active').length;
  const totalRevenue = members
    .filter(m => m.status === 'Active')
    .reduce((sum, m) => {
      const prices: { [key: string]: number } = { Basic: 2499, Premium: 4999, VIP: 8999 };
      return sum + (prices[m.plan] || 0);
    }, 0);

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
                <h1 className="text-white">AKHADA - Admin Panel</h1>
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
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8 bg-white shadow-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Members ({members.length})
            </TabsTrigger>
            <TabsTrigger value="trainers" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Trainers ({trainers.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white">Total Members</CardTitle>
                  <Users className="size-5 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-white">{members.length}</div>
                  <p className="text-white/80">+{activeMembers} active</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white">Active Trainers</CardTitle>
                  <User className="size-5 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-white">{trainers.length}</div>
                  <p className="text-white/80">All certified</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white">Monthly Revenue</CardTitle>
                  <DollarSign className="size-5 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-white">₹{totalRevenue.toLocaleString('en-IN')}</div>
                  <p className="text-white/80">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white">Growth Rate</CardTitle>
                  <TrendingUp className="size-5 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-white">+22%</div>
                  <p className="text-white/80">vs last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-slate-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="text-slate-900">Recent Members</CardTitle>
                  <CardDescription>Latest signups</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {members.slice(0, 4).map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-slate-600">{member.email}</p>
                        </div>
                        <Badge className={`${
                          member.plan === 'VIP' ? 'bg-purple-500' : 
                          member.plan === 'Premium' ? 'bg-orange-500' : 
                          'bg-blue-500'
                        }`}>
                          {member.plan}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-slate-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="text-slate-900">Trainer Overview</CardTitle>
                  <CardDescription>Active trainers</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {trainers.slice(0, 4).map((trainer) => (
                      <div key={trainer.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{trainer.name}</p>
                          <p className="text-slate-600">{trainer.specialization}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">⭐ {trainer.rating}</p>
                          <p className="text-slate-600">{trainer.clients} clients</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <Users className="size-6 text-orange-500" />
                      Members Database
                    </CardTitle>
                    <CardDescription>Manage all gym members</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setIsAddMemberOpen(true)}
                    >
                      <Plus className="mr-2 size-4" />
                      Add Member
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 size-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Contact</th>
                        <th className="text-left p-3">Plan</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-slate-600">{member.age} yrs, {member.gender}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <p className="text-slate-600">{member.email}</p>
                              <p className="text-slate-600">{member.phone}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={`${
                              member.plan === 'VIP' ? 'bg-purple-500' : 
                              member.plan === 'Premium' ? 'bg-orange-500' : 
                              'bg-blue-500'
                            }`}>
                              {member.plan}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge className={member.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}>
                              {member.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditMember(member)}
                              >
                                <Edit className="size-3 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteMember(member.id)}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trainers">
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <Dumbbell className="size-6 text-orange-500" />
                      Trainers Database
                    </CardTitle>
                    <CardDescription>Manage all gym trainers</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setIsAddTrainerOpen(true)}
                    >
                      <Plus className="mr-2 size-4" />
                      Add Trainer
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 size-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTrainers.map((trainer) => (
                    <Card key={trainer.id} className="border-2 border-slate-200 hover:border-orange-300 transition-colors">
                      <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-slate-900">{trainer.name}</CardTitle>
                            <CardDescription>{trainer.specialization}</CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openEditTrainer(trainer)}
                            >
                              <Edit className="size-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600"
                              onClick={() => handleDeleteTrainer(trainer.id)}
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-slate-600">Email</p>
                            <p className="font-medium text-sm">{trainer.email}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Phone</p>
                            <p className="font-medium">{trainer.phone}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Experience</p>
                            <p className="font-medium">{trainer.experience}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Clients</p>
                            <p className="font-medium">{trainer.clients}</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-slate-600">Salary</p>
                              <p className="font-medium text-green-600">{trainer.salary}/month</p>
                            </div>
                            <div className="text-right">
                              <p className="text-slate-600">Password</p>
                              <p className="font-medium">{trainer.password}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Settings className="size-6 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900">Gym Settings</CardTitle>
                    <CardDescription>Configure gym information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gymName">Gym Name</Label>
                    <Input id="gymName" defaultValue="AKHADA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gymEmail">Contact Email</Label>
                    <Input id="gymEmail" type="email" defaultValue="info@gym.akhada" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gymPhone">Contact Phone</Label>
                    <Input id="gymPhone" type="tel" defaultValue="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gymCity">City</Label>
                    <Input id="gymCity" defaultValue="Mumbai" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gymAddress">Full Address</Label>
                  <Input id="gymAddress" defaultValue="123 Fitness Street, Andheri West, Mumbai, Maharashtra 400053" />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>Enter member details to add them to the gym</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={memberForm.name} 
                onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
                placeholder="e.g., Rahul Sharma"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                value={memberForm.email} 
                onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
                placeholder="rahul@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                value={memberForm.phone} 
                onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input 
                type="number"
                value={memberForm.age} 
                onChange={(e) => setMemberForm({...memberForm, age: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={memberForm.gender} onValueChange={(value) => setMemberForm({...memberForm, gender: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={memberForm.plan} onValueChange={(value) => setMemberForm({...memberForm, plan: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic - ₹2,499/month</SelectItem>
                  <SelectItem value="Premium">Premium - ₹4,999/month</SelectItem>
                  <SelectItem value="VIP">VIP - ₹8,999/month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Address</Label>
              <Input 
                value={memberForm.address} 
                onChange={(e) => setMemberForm({...memberForm, address: e.target.value})}
                placeholder="Mumbai, Maharashtra"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember} className="bg-green-600 hover:bg-green-700">Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>Update member details</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={memberForm.name} 
                onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                value={memberForm.email} 
                onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                value={memberForm.phone} 
                onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input 
                type="number"
                value={memberForm.age} 
                onChange={(e) => setMemberForm({...memberForm, age: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={memberForm.gender} onValueChange={(value) => setMemberForm({...memberForm, gender: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={memberForm.plan} onValueChange={(value) => setMemberForm({...memberForm, plan: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic - ₹2,499/month</SelectItem>
                  <SelectItem value="Premium">Premium - ₹4,999/month</SelectItem>
                  <SelectItem value="VIP">VIP - ₹8,999/month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={memberForm.status} onValueChange={(value) => setMemberForm({...memberForm, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Address</Label>
              <Input 
                value={memberForm.address} 
                onChange={(e) => setMemberForm({...memberForm, address: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMemberOpen(false)}>Cancel</Button>
            <Button onClick={handleEditMember} className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Trainer Dialog */}
      <Dialog open={isAddTrainerOpen} onOpenChange={setIsAddTrainerOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Trainer</DialogTitle>
            <DialogDescription>Email will be auto-generated as name@gym.akhada</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={trainerForm.name} 
                onChange={(e) => setTrainerForm({...trainerForm, name: e.target.value})}
                placeholder="e.g., Raj Kumar"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                value={trainerForm.phone} 
                onChange={(e) => setTrainerForm({...trainerForm, phone: e.target.value})}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input 
                value={trainerForm.specialization} 
                onChange={(e) => setTrainerForm({...trainerForm, specialization: e.target.value})}
                placeholder="e.g., Strength Training"
              />
            </div>
            <div className="space-y-2">
              <Label>Experience</Label>
              <Input 
                value={trainerForm.experience} 
                onChange={(e) => setTrainerForm({...trainerForm, experience: e.target.value})}
                placeholder="e.g., 5 years"
              />
            </div>
            <div className="space-y-2">
              <Label>Certification</Label>
              <Input 
                value={trainerForm.certification} 
                onChange={(e) => setTrainerForm({...trainerForm, certification: e.target.value})}
                placeholder="e.g., ACE Certified"
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly Salary</Label>
              <Input 
                value={trainerForm.salary} 
                onChange={(e) => setTrainerForm({...trainerForm, salary: e.target.value})}
                placeholder="₹50,000"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                value={trainerForm.password} 
                onChange={(e) => setTrainerForm({...trainerForm, password: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTrainerOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTrainer} className="bg-green-600 hover:bg-green-700">Add Trainer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Trainer Dialog */}
      <Dialog open={isEditTrainerOpen} onOpenChange={setIsEditTrainerOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Trainer</DialogTitle>
            <DialogDescription>Update trainer details</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={trainerForm.name} 
                onChange={(e) => setTrainerForm({...trainerForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                value={trainerForm.email} 
                onChange={(e) => setTrainerForm({...trainerForm, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                value={trainerForm.phone} 
                onChange={(e) => setTrainerForm({...trainerForm, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input 
                value={trainerForm.specialization} 
                onChange={(e) => setTrainerForm({...trainerForm, specialization: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Experience</Label>
              <Input 
                value={trainerForm.experience} 
                onChange={(e) => setTrainerForm({...trainerForm, experience: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Certification</Label>
              <Input 
                value={trainerForm.certification} 
                onChange={(e) => setTrainerForm({...trainerForm, certification: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly Salary</Label>
              <Input 
                value={trainerForm.salary} 
                onChange={(e) => setTrainerForm({...trainerForm, salary: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                value={trainerForm.password} 
                onChange={(e) => setTrainerForm({...trainerForm, password: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTrainerOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTrainer} className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
