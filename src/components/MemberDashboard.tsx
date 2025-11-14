// src/components/MemberDashboard.tsx
import { useEffect, useMemo, useState } from "react";
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
import { supabase } from "../lib/supabase";

/* Local badge override (keeps your original look) */
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

  // Data
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any | null>(null);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch everything on mount / when user.email changes
  useEffect(() => {
    if (!user?.email) return;
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  async function refreshAll() {
    setLoading(true);
    setError(null);

    try {
      // 1) get member record by email
      const { data: memberRow, error: mErr } = await supabase
        .from("members")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (mErr) {
        // if 404-like (no table or other) still continue with null member
        console.warn("members fetch error", mErr);
      }
      setMember(memberRow ?? null);

      const memberId = memberRow?.id ?? null;

      // 2) Parallel fetches (some calls are guarded)
      const promises: Promise<any>[] = [];
      // checkins (if members exist)
      if (memberId) {
        promises.push(
          supabase
            .from("checkins")
            .select("*")
            .eq("member_id", memberId)
            .order("timestamp", { ascending: false })
            .limit(200)
        );
        // trainer_sessions
        promises.push(
          supabase
            .from("trainer_sessions")
            .select("*, trainers(name,email)")
            .eq("member_id", memberId)
            .order("timestamp", { ascending: false })
            .limit(200)
        );
        // payments
        promises.push(
          supabase
            .from("payments")
            .select("*")
            .eq("member_id", memberId)
            .order("timestamp", { ascending: false })
            .limit(200)
        );
      } else {
        // if no member found, still fetch nothing for those queries to avoid errors
        promises.push(Promise.resolve({ data: [], error: null }));
        promises.push(Promise.resolve({ data: [], error: null }));
        promises.push(Promise.resolve({ data: [], error: null }));
      }

      // classes (global list) — optional table
      promises.push(
        supabase
          .from("classes")
          .select("*")
          .order("start_time", { ascending: true })
          .limit(200)
          .catch((err) => ({ data: [], error: err }))
      );

      const [checkinRes, sessionsRes, paymentsRes, classesRes] =
        await Promise.all(promises);

      if (checkinRes?.error) console.warn("checkins error", checkinRes.error);
      if (sessionsRes?.error) console.warn("sessions error", sessionsRes.error);
      if (paymentsRes?.error) console.warn("payments error", paymentsRes.error);

      // set states (safe default empty arrays)
      setCheckins(checkinRes?.data ?? []);
      setSessions(sessionsRes?.data ?? []);
      setPayments(paymentsRes?.data ?? []);
      setClasses(classesRes?.error ? [] : classesRes?.data ?? []);

      // AUTO-CHECKIN: if member active, add a checkin if last is >6 hours
      try {
        if (memberId && memberRow) {
          const isActive = (memberRow.status || "").toLowerCase() === "active";
          if (isActive) {
            const last = (checkinRes?.data && checkinRes.data[0]) || null;
            const need =
              !last ||
              Date.now() - new Date(last.timestamp || last.created_at || 0).getTime() >
                1000 * 60 * 60 * 6;
            if (need) {
              await supabase.from("checkins").insert([{ member_id: memberId }]);
              // reload checkins
              const fresh = await supabase
                .from("checkins")
                .select("*")
                .eq("member_id", memberId)
                .order("timestamp", { ascending: false })
                .limit(200);
              if (!fresh.error) setCheckins(fresh.data ?? []);
            }
          }
        }
      } catch (e) {
        console.warn("auto-checkin failed", e);
      }
    } catch (err: any) {
      console.error("refreshAll error", err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  // Simple booking: book a class (decrement slot if field present). Old behaviour: click Book.
  async function bookClass(clazz: any) {
    if (!member?.id) {
      return alert("Member not loaded.");
    }
    setActionLoading(true);
    try {
      // If class has available_slots column, ensure > 0
      if (clazz?.available_slots != null) {
        if (clazz.available_slots <= 0) {
          alert("No slots available.");
          return;
        }
      }
      // Insert trainer_session (keeps schema simple & compatible with existing code)
      const { error: insErr } = await supabase.from("trainer_sessions").insert([
        {
          trainer_id: clazz?.trainer_id ?? null,
          member_id: member.id,
          session_type: clazz?.title ?? clazz?.name ?? "group_class",
        },
      ]);
      if (insErr) throw insErr;

      // decrement slot if exists
      if (clazz?.id && clazz?.available_slots != null) {
        const { error: updErr } = await supabase
          .from("classes")
          .update({ available_slots: clazz.available_slots - 1 })
          .eq("id", clazz.id);
        if (updErr) throw updErr;
      }

      alert("Booked successfully.");
      await refreshAll();
    } catch (e) {
      console.error("bookClass failed", e);
      alert("Booking failed.");
    } finally {
      setActionLoading(false);
    }
  }

  // Derived stats
  const totalCheckins = checkins.length;
  const totalSessions = sessions.length;
  const totalRevenue = useMemo(
    () => payments.reduce((s, p) => s + Number(p.amount || 0), 0),
    [payments]
  );

  // Compute current streak (consecutive days with checkin)
  const currentStreak = useMemo(() => {
    if (!checkins || checkins.length === 0) return 0;
    // Get unique dates (local) in descending order
    const daySet = new Set(
      checkins.map((c) =>
        new Date(c.timestamp || c.created_at || c.inserted_at).toDateString()
      )
    );
    const today = new Date();
    let streak = 0;
    for (let i = 0; ; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - i);
      if (daySet.has(dt.toDateString())) streak++;
      else break;
    }
    return streak;
  }, [checkins]);

  // membership text
  const membershipLabel = member?.plan ?? "—";
  const membershipExpiry = member?.expiry_date ?? "—";

  // available classes (filter out past or zero slots if available_slots present)
  const availableClasses = classes.filter((c: any) => {
    // if start_time present, ensure it's not past
    if (c.start_time && new Date(c.start_time) < new Date()) return false;
    if (c.available_slots != null) return c.available_slots > 0;
    return true;
  });

  // UI render
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin mr-3">
          <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
            />
          </svg>
        </div>
        <div>Loading your member dashboard...</div>
      </div>
    );
  }

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
                  Welcome back, {member?.name ?? user.name}
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

          {/* OVERVIEW */}
          <TabsContent value="overview">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-white">Workouts</CardTitle>
                  <Activity className="size-4 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCheckins}</div>
                  <p className="text-white/80">+{Math.max(0, totalCheckins - 0)} from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-white">Classes Booked</CardTitle>
                  <Calendar className="size-4 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSessions}</div>
                  <p className="text-white/80">Upcoming: {sessions[0] ? new Date(sessions[0].timestamp).toLocaleDateString() : "—"}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-white">Current Streak</CardTitle>
                  <Dumbbell className="size-4 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentStreak} days</div>
                  <p className="text-white/80">Keep it going!</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-white">Membership</CardTitle>
                  <User className="size-4 text-white/80" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{membershipLabel}</div>
                  <p className="text-white/80">Expires {membershipExpiry}</p>
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
                  {sessions.length === 0 && checkins.length === 0 ? (
                    <div className="text-slate-500 text-sm">No activity yet</div>
                  ) : (
                    // show sessions first (recent), then fallback to checkins
                    (sessions.length > 0 ? sessions.slice(0, 6).map((s, i) => (
                      <div
                        key={s.id ?? i}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{s.session_type}</p>
                          <p className="text-slate-600 text-sm">{s.timestamp ? new Date(s.timestamp).toLocaleString() : "—"}</p>
                        </div>
                        <Badge className="bg-green-600">Completed</Badge>
                      </div>
                    )) : checkins.slice(0, 6).map((c, i) => (
                      <div
                        key={c.id ?? i}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">Check-in</p>
                          <p className="text-slate-600 text-sm">{c.timestamp ? new Date(c.timestamp).toLocaleString() : "—"}</p>
                        </div>
                        <Badge className="bg-green-600">Done</Badge>
                      </div>
                    )))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* HEALTH */}
          <TabsContent value="health">
            <BMICalculator />
          </TabsContent>

          {/* WORKOUT */}
          <TabsContent value="workout">
            <ExerciseRandomizer />
          </TabsContent>

          {/* CLASS BOOKING */}
          <TabsContent value="classes">
            <div className="space-y-4">
              <ClassBooking /> {/* If you have a dedicated component, it can remain here */}
              <div className="bg-white rounded shadow p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Available Classes</h3>
                  <div className="text-sm text-slate-500">{availableClasses.length} available</div>
                </div>

                {availableClasses.length === 0 ? (
                  <div className="text-sm text-slate-500">No available classes right now</div>
                ) : (
                  availableClasses.map((c: any) => (
                    <div key={c.id ?? c.title} className="py-3 border-t first:border-t-0 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{c.title ?? c.name ?? "Class"}</div>
                        <div className="text-xs text-slate-500">
                          {c.start_time ? new Date(c.start_time).toLocaleString() : (c.description ?? "")}
                        </div>
                        <div className="text-xs text-slate-500">Slots: {c.available_slots ?? "—"}</div>
                      </div>
                      <div>
                        <button onClick={() => bookClass(c)} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={actionLoading}>
                          Book
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* PROFILE */}
          <TabsContent value="profile">
            <MemberProfile user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
