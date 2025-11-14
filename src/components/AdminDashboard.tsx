import React, { useState } from "react";
import { Dumbbell, LogOut, Users, DollarSign, TrendingUp, User, Settings, Search, Download, Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import SolidDialogContent from "./ui/solid-dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

/* Types */
type UserProps = { email: string; name: string; role: string; };
type UserRole = "admin" | "trainer" | "member";

/* Sample data (you can wire to supabase later) */
interface Member {
  id: number; name: string; email: string; phone: string; plan: string; status: string; joined: string; expiry: string; age: number; gender: string; address: string;
}
interface Trainer {
  id: number; name: string; email: string; phone: string; specialization: string; experience: string; certification: string; clients: number; rating: number; salary: string; joined: string; password?: string;
}

const initialMembers: Member[] = [
  { id:1, name:'Rahul Verma', email:'rahul.verma@gmail.com', phone:'+91 98765 43210', plan:'Premium', status:'Active', joined:'Jan 15, 2025', expiry:'Jan 15, 2026', age:28, gender:'Male', address:'Mumbai' },
  { id:2, name:'Priya Kapoor', email:'priya.k@gmail.com', phone:'+91 98123 45678', plan:'VIP', status:'Active', joined:'Feb 10, 2025', expiry:'Feb 10, 2026', age:25, gender:'Female', address:'Delhi' },
  { id:3, name:'Arjun Mehta', email:'arjun.mehta@gmail.com', phone:'+91 97654 32109', plan:'Basic', status:'Active', joined:'Mar 05, 2025', expiry:'Mar 05, 2026', age:32, gender:'Male', address:'Bangalore' },
];

const initialTrainers: Trainer[] = [
  { id:1, name:'Vikram Singh', email:'vikram.singh@gym.akhada', phone:'+91 98888 12345', specialization:'Strength & Conditioning', experience:'8 years', certification:'ACE Certified', clients:12, rating:4.9, salary:'₹65,000', joined:'Jan 2022', password:'Trainer@12345' },
  { id:2, name:'Priya Sharma', email:'priya.sharma@gym.akhada', phone:'+91 98777 23456', specialization:'Yoga & Flexibility', experience:'6 years', certification:'RYT 500', clients:18, rating:4.8, salary:'₹55,000', joined:'Jun 2022', password:'Trainer@12345' },
];

export default function AdminDashboard({ user, onLogout }: { user: UserProps; onLogout: ()=>void; }) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);

  // Dialog states (use Radix Dialog but render content via SolidDialogContent)
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [addTrainerOpen, setAddTrainerOpen] = useState(false);
  const [editTrainerOpen, setEditTrainerOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  // simple forms
  const [memberForm, setMemberForm] = useState<Partial<Member>>({});
  const [trainerForm, setTrainerForm] = useState<Partial<Trainer>>({});

  const filteredMembers = members.filter(m => {
    const q = searchTerm.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q);
  });

  const filteredTrainers = trainers.filter(t => {
    const q = searchTerm.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q);
  });

  const addMember = () => {
    const newMember: Member = {
      id: Math.max(...members.map(m => m.id), 0) + 1,
      name: memberForm.name || "New Member",
      email: memberForm.email || "no-email@example.com",
      phone: memberForm.phone || "+91 00000 00000",
      plan: memberForm.plan || "Basic",
      status: memberForm.status || "Active",
      joined: new Date().toLocaleDateString(),
      expiry: new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString(),
      age: memberForm.age || 20,
      gender: memberForm.gender || "Other",
      address: memberForm.address || ""
    };
    setMembers(prev => [...prev, newMember]);
    setAddMemberOpen(false);
    setMemberForm({});
  };

  const openEditMember = (m: Member) => {
    setSelectedMember(m);
    setMemberForm(m);
    setEditMemberOpen(true);
  };

  const saveEditMember = () => {
    if (!selectedMember) return;
    setMembers(prev => prev.map(p => p.id === selectedMember.id ? ({ ...(p as Member), ...(memberForm as Member) }) : p));
    setEditMemberOpen(false);
    setSelectedMember(null);
    setMemberForm({});
  };

  const deleteMember = (id:number) => {
    if (!confirm("Delete member?")) return;
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const addTrainer = () => {
    const newTrainer: Trainer = {
      id: Math.max(...trainers.map(t => t.id), 0) + 1,
      name: trainerForm.name || "New Trainer",
      email: trainerForm.email || `${(trainerForm.name || "trainer").toString().replace(/\s+/g,'.').toLowerCase()}@gym.akhada`,
      phone: trainerForm.phone || "+91 00000 00000",
      specialization: trainerForm.specialization || "",
      experience: trainerForm.experience || "",
      certification: trainerForm.certification || "",
      clients: trainerForm.clients || 0,
      rating: trainerForm.rating || 4.5,
      salary: trainerForm.salary || "₹50,000",
      joined: new Date().toLocaleDateString(),
      password: trainerForm.password || "Trainer@12345"
    };
    setTrainers(prev => [...prev, newTrainer]);
    setAddTrainerOpen(false);
    setTrainerForm({});
  };

  const openEditTrainer = (t: Trainer) => {
    setSelectedTrainer(t);
    setTrainerForm(t);
    setEditTrainerOpen(true);
  };

  const saveEditTrainer = () => {
    if (!selectedTrainer) return;
    setTrainers(prev => prev.map(p => p.id === selectedTrainer.id ? ({ ...(p as Trainer), ...(trainerForm as Trainer) }) : p));
    setEditTrainerOpen(false);
    setSelectedTrainer(null);
    setTrainerForm({});
  };

  const deleteTrainer = (id:number) => {
    if (!confirm("Delete trainer?")) return;
    setTrainers(prev => prev.filter(t => t.id !== id));
  };

  const activeMembersCount = members.filter(m => m.status === "Active").length;
  const totalRevenue = members.reduce((s,m) => {
    const map: Record<string,number> = { Basic: 2499, Premium: 4999, VIP: 8999 };
    return s + (map[m.plan] || 0);
  }, 0);

  return (
    <div className="min-h-screen">
      {/* Dark Header */}
      <header className="site-header sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Dumbbell className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-lg font-semibold">AKHADA - Admin Panel</h1>
              <p className="header-subtext">{`Welcome, ${user.name}`}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Input value={searchTerm} onChange={(e:any)=>setSearchTerm(e.target.value)} placeholder="Search members or trainers..." className="w-80" />
            <Button onClick={onLogout} variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
              <LogOut className="mr-2 size-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main container - light cards */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v:any)=>setActiveTab(v)}>
          <TabsList className="grid grid-cols-4 gap-2 max-w-2xl mx-auto mb-8 bg-white shadow-md rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Members ({members.length})</TabsTrigger>
            <TabsTrigger value="trainers" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Trainers ({trainers.length})</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="card-light shadow-lg">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>Total Members</CardTitle>
                  <Users className="size-5 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{members.length}</div>
                  <p className="text-slate-600">Active: {activeMembersCount}</p>
                </CardContent>
              </Card>

              <Card className="card-light shadow-lg">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>Trainers</CardTitle>
                  <User className="size-5 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{trainers.length}</div>
                  <p className="text-slate-600">Certified & Active</p>
                </CardContent>
              </Card>

              <Card className="card-light shadow-lg">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>Monthly Revenue</CardTitle>
                  <DollarSign className="size-5 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                  <p className="text-slate-600">Projected</p>
                </CardContent>
              </Card>

              <Card className="card-light shadow-lg">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>Growth</CardTitle>
                  <TrendingUp className="size-5 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">+22%</div>
                  <p className="text-slate-600">vs last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Listing Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-light shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle>Recent Members</CardTitle>
                  <CardDescription>Latest signups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.slice(0,4).map(m => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{m.name}</p>
                          <p className="text-slate-600">{m.email}</p>
                        </div>
                        <Badge className={m.plan === 'VIP' ? 'bg-purple-500' : m.plan === 'Premium' ? 'bg-orange-500' : 'bg-blue-500'}>{m.plan}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-light shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle>Trainer Overview</CardTitle>
                  <CardDescription>Active trainers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trainers.slice(0,4).map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <p className="text-slate-600">{t.specialization}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">⭐ {t.rating}</p>
                          <p className="text-slate-600">{t.clients} clients</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card className="card-light shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Users className="text-orange-500" /> Members Database</CardTitle>
                  <CardDescription>Manage all gym members</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={()=>setAddMemberOpen(true)}><Plus className="mr-2" />Add Member</Button>
                  <Button variant="outline"><Download className="mr-2" />Export</Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input value={searchTerm} onChange={(e:any)=>setSearchTerm(e.target.value)} placeholder="Search by name, email, phone..." className="pl-10" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Contact</th>
                        <th className="text-left p-3">Plan</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map(m => (
                        <tr key={m.id} className="border-b hover:bg-slate-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{m.name}</p>
                              <p className="text-slate-600">{m.age} yrs, {m.gender}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <p className="text-slate-600">{m.email}</p>
                              <p className="text-slate-600">{m.phone}</p>
                            </div>
                          </td>
                          <td className="p-3"><Badge className={m.plan === 'VIP' ? 'bg-purple-500' : m.plan === 'Premium' ? 'bg-orange-500' : 'bg-blue-500'}>{m.plan}</Badge></td>
                          <td className="p-3"><Badge className={m.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}>{m.status}</Badge></td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={()=>openEditMember(m)}><Edit className="size-3 mr-1" />Edit</Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={()=>deleteMember(m.id)}><Trash2 className="size-3" /></Button>
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

          {/* Trainers Tab */}
          <TabsContent value="trainers">
            <Card className="card-light shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Dumbbell className="text-orange-500" /> Trainers Database</CardTitle>
                  <CardDescription>Manage all trainers</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={()=>setAddTrainerOpen(true)}><Plus className="mr-2" />Add Trainer</Button>
                  <Button variant="outline"><Download className="mr-2" />Export</Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTrainers.map(t => (
                    <Card key={t.id} className="border hover:border-orange-300 transition-colors">
                      <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-slate-900">{t.name}</CardTitle>
                            <CardDescription>{t.specialization}</CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={()=>openEditTrainer(t)}><Edit className="size-3" /></Button>
                            <Button variant="outline" size="sm" className="text-red-600" onClick={()=>deleteTrainer(t.id)}><Trash2 className="size-3" /></Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          <div><p className="text-slate-600">Email</p><p className="font-medium text-sm">{t.email}</p></div>
                          <div><p className="text-slate-600">Phone</p><p className="font-medium">{t.phone}</p></div>
                          <div><p className="text-slate-600">Experience</p><p className="font-medium">{t.experience}</p></div>
                          <div><p className="text-slate-600">Clients</p><p className="font-medium">{t.clients}</p></div>
                        </div>
                        <div className="pt-3 border-t border-slate-200 flex justify-between">
                          <div><p className="text-slate-600">Salary</p><p className="font-medium text-green-600">{t.salary}/mo</p></div>
                          <div className="text-right"><p className="text-slate-600">Password</p><p className="font-medium">{t.password}</p></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card className="card-light shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg"><Settings className="text-orange-500" /></div>
                  <div>
                    <CardTitle>Gym Settings</CardTitle>
                    <CardDescription>Configure gym information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="gymName">Gym Name</Label><Input id="gymName" defaultValue="AKHADA" /></div>
                  <div className="space-y-2"><Label htmlFor="gymEmail">Contact Email</Label><Input id="gymEmail" defaultValue="info@gym.akhada" /></div>
                  <div className="space-y-2"><Label htmlFor="gymPhone">Contact Phone</Label><Input id="gymPhone" defaultValue="+91 98765 43210" /></div>
                  <div className="space-y-2"><Label htmlFor="gymCity">City</Label><Input id="gymCity" defaultValue="Mumbai" /></div>
                </div>
                <div className="space-y-2 mt-4"><Label htmlFor="gymAddress">Full Address</Label><Input id="gymAddress" defaultValue="123 Fitness Street, Andheri West, Mumbai" /></div>
                <div className="mt-4"><Button className="bg-orange-500 hover:bg-orange-600">Save Settings</Button></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Member Dialog */}
      <DialogPrimitive.Root open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogPrimitive.Portal>
          <SolidDialogContent>
            <DialogPrimitive.Title className="text-lg font-semibold mb-2">Add New Member</DialogPrimitive.Title>
            <DialogPrimitive.Description className="mb-4 text-slate-300">Enter member details</DialogPrimitive.Description>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input value={memberForm.name||""} onChange={(e:any)=>setMemberForm({...memberForm, name:e.target.value})} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={memberForm.email||""} onChange={(e:any)=>setMemberForm({...memberForm, email:e.target.value})} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={memberForm.phone||""} onChange={(e:any)=>setMemberForm({...memberForm, phone:e.target.value})} /></div>
              <div className="space-y-2"><Label>Age</Label><Input type="number" value={memberForm.age||""} onChange={(e:any)=>setMemberForm({...memberForm, age:parseInt(e.target.value||"0")})} /></div>
              <div className="space-y-2"><Label>Gender</Label>
                <Select value={memberForm.gender as any} onValueChange={(v:any)=>setMemberForm({...memberForm, gender:v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Plan</Label>
                <Select value={memberForm.plan as any} onValueChange={(v:any)=>setMemberForm({...memberForm, plan:v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Basic">Basic</SelectItem><SelectItem value="Premium">Premium</SelectItem><SelectItem value="VIP">VIP</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2"><Label>Address</Label><Input value={memberForm.address||""} onChange={(e:any)=>setMemberForm({...memberForm,address:e.target.value})} /></div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={()=>setAddMemberOpen(false)}>Cancel</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={addMember}>Add Member</Button>
            </div>
          </SolidDialogContent>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Edit Member Dialog */}
      <DialogPrimitive.Root open={editMemberOpen} onOpenChange={setEditMemberOpen}>
        <DialogPrimitive.Portal>
          <SolidDialogContent>
            <DialogPrimitive.Title className="text-lg font-semibold mb-2">Edit Member</DialogPrimitive.Title>
            <DialogPrimitive.Description className="mb-4 text-slate-300">Update member details</DialogPrimitive.Description>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input value={memberForm.name||""} onChange={(e:any)=>setMemberForm({...memberForm, name:e.target.value})} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={memberForm.email||""} onChange={(e:any)=>setMemberForm({...memberForm, email:e.target.value})} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={memberForm.phone||""} onChange={(e:any)=>setMemberForm({...memberForm, phone:e.target.value})} /></div>
              <div className="space-y-2"><Label>Age</Label><Input type="number" value={memberForm.age||""} onChange={(e:any)=>setMemberForm({...memberForm, age:parseInt(e.target.value||"0")})} /></div>
              <div className="space-y-2"><Label>Gender</Label>
                <Select value={memberForm.gender as any} onValueChange={(v:any)=>setMemberForm({...memberForm, gender:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Plan</Label>
                <Select value={memberForm.plan as any} onValueChange={(v:any)=>setMemberForm({...memberForm, plan:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Basic">Basic</SelectItem><SelectItem value="Premium">Premium</SelectItem><SelectItem value="VIP">VIP</SelectItem></SelectContent></Select>
              </div>
              <div className="col-span-2 space-y-2"><Label>Address</Label><Input value={memberForm.address||""} onChange={(e:any)=>setMemberForm({...memberForm,address:e.target.value})}/></div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={()=>setEditMemberOpen(false)}>Cancel</Button>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={saveEditMember}>Save Changes</Button>
            </div>
          </SolidDialogContent>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Add/Edit Trainer Dialogs (similar pattern) */}
      <DialogPrimitive.Root open={addTrainerOpen} onOpenChange={setAddTrainerOpen}>
        <DialogPrimitive.Portal>
          <SolidDialogContent>
            <DialogPrimitive.Title className="text-lg font-semibold mb-2">Add Trainer</DialogPrimitive.Title>
            <DialogPrimitive.Description className="mb-4 text-slate-300">Enter trainer details</DialogPrimitive.Description>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input value={trainerForm.name||""} onChange={(e:any)=>setTrainerForm({...trainerForm,name:e.target.value})} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={trainerForm.phone||""} onChange={(e:any)=>setTrainerForm({...trainerForm,phone:e.target.value})} /></div>
              <div className="space-y-2"><Label>Specialization</Label><Input value={trainerForm.specialization||""} onChange={(e:any)=>setTrainerForm({...trainerForm,specialization:e.target.value})} /></div>
              <div className="space-y-2"><Label>Experience</Label><Input value={trainerForm.experience||""} onChange={(e:any)=>setTrainerForm({...trainerForm,experience:e.target.value})} /></div>
              <div className="space-y-2"><Label>Certification</Label><Input value={trainerForm.certification||""} onChange={(e:any)=>setTrainerForm({...trainerForm,certification:e.target.value})} /></div>
              <div className="space-y-2"><Label>Salary</Label><Input value={trainerForm.salary||""} onChange={(e:any)=>setTrainerForm({...trainerForm,salary:e.target.value})} /></div>
              <div className="col-span-2 space-y-2"><Label>Password</Label><Input value={trainerForm.password||""} onChange={(e:any)=>setTrainerForm({...trainerForm,password:e.target.value})} /></div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={()=>setAddTrainerOpen(false)}>Cancel</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={addTrainer}>Add Trainer</Button>
            </div>
          </SolidDialogContent>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <DialogPrimitive.Root open={editTrainerOpen} onOpenChange={setEditTrainerOpen}>
        <DialogPrimitive.Portal>
          <SolidDialogContent>
            <DialogPrimitive.Title className="text-lg font-semibold mb-2">Edit Trainer</DialogPrimitive.Title>
            <DialogPrimitive.Description className="mb-4 text-slate-300">Update trainer details</DialogPrimitive.Description>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input value={trainerForm.name||""} onChange={(e:any)=>setTrainerForm({...trainerForm,name:e.target.value})} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={trainerForm.email||""} onChange={(e:any)=>setTrainerForm({...trainerForm,email:e.target.value})} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={trainerForm.phone||""} onChange={(e:any)=>setTrainerForm({...trainerForm,phone:e.target.value})} /></div>
              <div className="space-y-2"><Label>Specialization</Label><Input value={trainerForm.specialization||""} onChange={(e:any)=>setTrainerForm({...trainerForm,specialization:e.target.value})} /></div>
              <div className="space-y-2"><Label>Experience</Label><Input value={trainerForm.experience||""} onChange={(e:any)=>setTrainerForm({...trainerForm,experience:e.target.value})} /></div>
              <div className="col-span-2 space-y-2"><Label>Certification</Label><Input value={trainerForm.certification||""} onChange={(e:any)=>setTrainerForm({...trainerForm,certification:e.target.value})} /></div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={()=>setEditTrainerOpen(false)}>Cancel</Button>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={saveEditTrainer}>Save Changes</Button>
            </div>
          </SolidDialogContent>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
