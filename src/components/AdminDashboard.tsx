// src/components/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type UserMinimal = { email: string; role: string; name: string };

type Member = {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  plan?: string | null;
  status?: string | null;
  age?: number | null;
  gender?: string | null;
  address?: string | null;
  joined_date?: string | null;
  expiry_date?: string | null;
  created_at?: string | null;
};

type Trainer = {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  specialization?: string | null;
  clients?: number | null;
  rating?: number | null;
  salary?: string | null;
  joined_date?: string | null;
  created_at?: string | null;
};

type Payment = {
  id: number;
  member_id?: number | null;
  pass_id?: number | null;
  amount: number;
  payment_type: string;
  method?: string | null;
  timestamp?: string | null;
};

type OneDayPass = {
  id: number;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  booking_type?: string | null;
  payment_status?: string | null;
  amount?: number | null;
  booking_date?: string | null;
  expires_at?: string | null;
  qr_code?: string | null;
};

type Checkin = {
  id: number;
  member_id?: number | null;
  timestamp?: string | null;
};

export default function AdminDashboard({
  user,
  onLogout,
}: {
  user: UserMinimal;
  onLogout: () => void;
}) {
  const [active, setActive] = useState<
    "overview" | "members" | "trainers" | "payments" | "checkins" | "passes" | "analytics"
  >("overview");

  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [passes, setPasses] = useState<OneDayPass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI: form states
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<Member> | null>(null);
  const [showTrainerForm, setShowTrainerForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Partial<Trainer> | null>(null);

  useEffect(() => {
    reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reloadAll() {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        reloadMembers(),
        reloadTrainers(),
        reloadPayments(),
        reloadCheckins(),
        reloadPasses(),
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function reloadMembers() {
    const { data, error } = await supabase
      .from<Member>("members")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      console.error("members fetch error", error);
      throw error;
    }
    // filter out demo accounts — adjust condition if you have a specific demo flag
    const filtered = (data ?? []).filter((m) => !(m.email ?? "").startsWith("test.") && (m.name ?? "").toLowerCase() !== "test user");
    setMembers(filtered);
  }

  async function reloadTrainers() {
    const { data, error } = await supabase.from<Trainer>("trainers").select("*").order("id", { ascending: true });
    if (error) {
      console.error("trainers fetch error", error);
      throw error;
    }
    setTrainers(data ?? []);
  }

  async function reloadPayments() {
    const { data, error } = await supabase.from<Payment>("payments").select("*").order("timestamp", { ascending: false });
    if (error) {
      console.error("payments fetch error", error);
      throw error;
    }
    // remove demo payments (if any)
    const filtered = (data ?? []).filter((p) => (p.amount ?? 0) > 0);
    setPayments(filtered);
  }

  async function reloadCheckins() {
    const { data, error } = await supabase.from<Checkin>("checkins").select("*").order("timestamp", { ascending: false });
    if (error) {
      console.error("checkins fetch error", error);
      throw error;
    }
    setCheckins(data ?? []);
  }

  async function reloadPasses() {
    // Only include passes that are NOT expired (for visible list) but keep all in DB
    const { data, error } = await supabase.from<OneDayPass>("one_day_passes").select("*").order("booking_date", { ascending: false });
    if (error) {
      console.error("passes fetch error", error);
      throw error;
    }
    const now = new Date();
    const visible = (data ?? []).filter((p) => {
      if (!p.expires_at) return true;
      const exp = new Date(p.expires_at);
      return exp > now; // show only not-yet-expired
    });
    setPasses(visible);
  }

  /* ---------------------------
     MEMBER CRUD (simple)
     --------------------------- */
  async function saveMember(payload: Partial<Member>) {
    setLoading(true);
    try {
      if (payload.id) {
        const { error } = await supabase.from("members").update(payload).eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("members").insert([payload]);
        if (error) throw error;
      }
      await reloadMembers();
      setShowMemberForm(false);
      setEditingMember(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save member");
    } finally {
      setLoading(false);
    }
  }

  async function deleteMember(id: number) {
    if (!confirm("Delete member permanently?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
      await reloadMembers();
    } catch (err) {
      console.error(err);
      setError("Failed to delete member");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------
     TRAINER CRUD
     --------------------------- */
  async function saveTrainer(payload: Partial<Trainer>) {
    setLoading(true);
    try {
      if (payload.id) {
        const { error } = await supabase.from("trainers").update(payload).eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("trainers").insert([payload]);
        if (error) throw error;
      }
      await reloadTrainers();
      setShowTrainerForm(false);
      setEditingTrainer(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save trainer");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTrainer(id: number) {
    if (!confirm("Delete trainer permanently?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("trainers").delete().eq("id", id);
      if (error) throw error;
      await reloadTrainers();
    } catch (err) {
      console.error(err);
      setError("Failed to delete trainer");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------
     UTILITIES: Analytics computed from fetched data
     --------------------------- */
  const totalRevenue = payments.reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const revenueLast7Days = (() => {
    const days: { label: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      const sum = payments
        .filter((p) => {
          if (!p.timestamp) return false;
          const ts = new Date(p.timestamp);
          return ts.toDateString() === d.toDateString();
        })
        .reduce((s, p) => s + Number(p.amount ?? 0), 0);
      days.push({ label, amount: sum });
    }
    return days;
  })();

  const sessionsCount = checkins.length;
  const activeMembers = members.filter((m) => (m.status ?? "").toLowerCase() === "active").length;
  const trainerCount = trainers.length;
  const passesCount = passes.length;

  /* ---------------------------
     Small UI helpers
     --------------------------- */
  function currency(n: number) {
    return `₹${n.toFixed(2)}`;
  }

  /* ---------------------------
     Compact inline components (forms)
     --------------------------- */

  function MemberForm({
    initial,
    onCancel,
    onSave,
  }: {
    initial?: Partial<Member>;
    onCancel: () => void;
    onSave: (p: Partial<Member>) => Promise<void>;
  }) {
    const [form, setForm] = useState<Partial<Member>>(initial ?? {});
    useEffect(() => setForm(initial ?? {}), [initial]);

    return (
      <div className="p-4">
        <h3 className="font-semibold mb-3">{initial?.id ? "Edit Member" : "Add Member"}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="p-2 border rounded" />
          <input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="p-2 border rounded" />
          <input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="p-2 border rounded" />
          <input value={form.plan ?? ""} onChange={(e) => setForm({ ...form, plan: e.target.value })} placeholder="Plan" className="p-2 border rounded" />
          <input value={form.status ?? ""} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="Status" className="p-2 border rounded" />
          <input value={form.age ?? "" as any} onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined })} placeholder="Age" className="p-2 border rounded" />
          <input value={form.gender ?? ""} onChange={(e) => setForm({ ...form, gender: e.target.value })} placeholder="Gender" className="p-2 border rounded" />
          <input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className="p-2 border rounded col-span-2" />
        </div>
        <div className="flex gap-2 justify-end mt-3">
          <button onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={() => onSave(form)} className="px-3 py-1 bg-orange-500 text-white rounded">Save</button>
        </div>
      </div>
    );
  }

  function TrainerForm({
    initial,
    onCancel,
    onSave,
  }: {
    initial?: Partial<Trainer>;
    onCancel: () => void;
    onSave: (p: Partial<Trainer>) => Promise<void>;
  }) {
    const [form, setForm] = useState<Partial<Trainer>>(initial ?? {});
    useEffect(() => setForm(initial ?? {}), [initial]);

    return (
      <div className="p-4">
        <h3 className="font-semibold mb-3">{initial?.id ? "Edit Trainer" : "Add Trainer"}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="p-2 border rounded" />
          <input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="p-2 border rounded" />
          <input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="p-2 border rounded" />
          <input value={form.specialization ?? ""} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="Specialization" className="p-2 border rounded" />
          <input value={form.clients ?? "" as any} onChange={(e) => setForm({ ...form, clients: e.target.value ? Number(e.target.value) : undefined })} placeholder="Clients" className="p-2 border rounded" />
          <input value={form.salary ?? ""} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="Salary" className="p-2 border rounded" />
        </div>
        <div className="flex gap-2 justify-end mt-3">
          <button onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={() => onSave(form)} className="px-3 py-1 bg-orange-500 text-white rounded">Save</button>
        </div>
      </div>
    );
  }

  /* ---------------------------
     RENDER
     --------------------------- */

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col gap-4">
        <div>
          <div className="text-xl font-bold text-orange-600">AKHADA</div>
          <div className="text-xs text-slate-500">Admin Panel</div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActive("overview")} className={`w-full text-left px-3 py-2 rounded ${active === "overview" ? "bg-orange-100" : "hover:bg-slate-50"}`}>Overview</button>
            </li>
            <li>
              <button onClick={() => setActive("members")} className={`w-full text-left px-3 py-2 rounded ${active === "members" ? "bg-orange-100" : "hover:bg-slate-50"}`}>
                Members <span className="ml-2 text-xs text-slate-500">({members.length})</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActive("trainers")} className={`w-full text-left px-3 py-2 rounded ${active === "trainers" ? "bg-orange-100" : "hover:bg-slate-50"}`}>
                Trainers <span className="ml-2 text-xs text-slate-500">({trainers.length})</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActive("payments")} className={`w-full text-left px-3 py-2 rounded ${active === "payments" ? "bg-orange-100" : "hover:bg-slate-50"}`}>
                Payments <span className="ml-2 text-xs text-slate-500">({payments.length})</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActive("checkins")} className={`w-full text-left px-3 py-2 rounded ${active === "checkins" ? "bg-orange-100" : "hover:bg-slate-50"}`}>
                Check-ins <span className="ml-2 text-xs text-slate-500">({checkins.length})</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActive("passes")} className={`w-full text-left px-3 py-2 rounded ${active === "passes" ? "bg-orange-100" : "hover:bg-slate-50"}`}>
                One-day Passes <span className="ml-2 text-xs text-slate-500">({passes.length})</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActive("analytics")} className={`w-full text-left px-3 py-2 rounded ${active === "analytics" ? "bg-orange-100" : "hover:bg-slate-50"}`}>
                Analytics
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto">
          <div className="text-xs text-slate-500 mb-2">Signed in as</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{user?.name}</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>
            <button onClick={onLogout} className="px-3 py-2 bg-slate-100 rounded">Sign out</button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">{active === "overview" ? "Overview" : active.charAt(0).toUpperCase() + active.slice(1)}</h2>
          <div className="flex items-center gap-3">
            <button onClick={reloadAll} className="px-3 py-2 border rounded">Refresh</button>
            <div className="text-sm text-slate-500">Last sync: {new Date().toLocaleString()}</div>
          </div>
        </header>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}
        {loading && <div className="mb-4 text-slate-500">Loading...</div>}

        {/* OVERVIEW */}
        {active === "overview" && (
          <section className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded shadow">
                <div className="text-sm text-slate-500">Total Revenue</div>
                <div className="text-2xl font-semibold mt-2">{currency(totalRevenue)}</div>
              </div>
              <div className="p-4 bg-white rounded shadow">
                <div className="text-sm text-slate-500">Active Members</div>
                <div className="text-2xl font-semibold mt-2">{activeMembers}</div>
              </div>
              <div className="p-4 bg-white rounded shadow">
                <div className="text-sm text-slate-500">Total Sessions</div>
                <div className="text-2xl font-semibold mt-2">{sessionsCount}</div>
              </div>
              <div className="p-4 bg-white rounded shadow">
                <div className="text-sm text-slate-500">Trainers</div>
                <div className="text-2xl font-semibold mt-2">{trainerCount}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-slate-600">Revenue (last 7 days)</div>
                </div>
                <div className="space-y-2">
                  {/* Simple CSS bar chart */}
                  {revenueLast7Days.map((d) => {
                    const max = Math.max(...revenueLast7Days.map((r) => r.amount), 1);
                    const pct = (d.amount / max) * 100;
                    return (
                      <div key={d.label} className="flex items-center gap-3">
                        <div className="w-24 text-xs text-slate-600">{d.label}</div>
                        <div className="flex-1 bg-slate-100 h-6 rounded overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-6 rounded bg-orange-400" />
                        </div>
                        <div className="w-20 text-right text-sm">{currency(d.amount)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-white rounded shadow">
                <div className="text-sm text-slate-600 mb-3">Quick Actions</div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setActive("members"); }} className="px-3 py-2 border rounded text-left">Manage Members</button>
                  <button onClick={() => { setActive("trainers"); }} className="px-3 py-2 border rounded text-left">Manage Trainers</button>
                  <button onClick={() => { setActive("payments"); }} className="px-3 py-2 border rounded text-left">View Payments</button>
                  <button onClick={() => { setActive("passes"); }} className="px-3 py-2 border rounded text-left">View One-day Passes</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MEMBERS */}
        {active === "members" && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Members</h3>
              <div>
                <button onClick={() => { setEditingMember(null); setShowMemberForm(true); }} className="px-3 py-2 bg-green-600 text-white rounded">+ Add Member</button>
              </div>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Contact</th>
                    <th className="text-left px-4 py-3">Plan</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} className="border-t">
                      <td className="px-4 py-4">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-slate-500">{m.joined_date ?? "-"}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div>{m.email}</div>
                        <div className="text-xs text-slate-500">{m.phone ?? "-"}</div>
                      </td>
                      <td className="px-4 py-4">{m.plan ?? "-"}</td>
                      <td className="px-4 py-4">{m.status ?? "-"}</td>
                      <td className="px-4 py-4 text-right">
                        <button onClick={() => { setEditingMember(m); setShowMemberForm(true); }} className="px-2 py-1 border rounded mr-2">Edit</button>
                        <button onClick={() => deleteMember(m.id!)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {members.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-500">No members</td></tr>}
                </tbody>
              </table>
            </div>

            {/* Member modal */}
            {showMemberForm && (
              <Modal onClose={() => { setShowMemberForm(false); setEditingMember(null); }}>
                <MemberForm
                  initial={editingMember ?? undefined}
                  onCancel={() => { setShowMemberForm(false); setEditingMember(null); }}
                  onSave={async (p) => await saveMember(p)}
                />
              </Modal>
            )}
          </section>
        )}

        {/* TRAINERS */}
        {active === "trainers" && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Trainers</h3>
              <div>
                <button onClick={() => { setEditingTrainer(null); setShowTrainerForm(true); }} className="px-3 py-2 bg-green-600 text-white rounded">+ Add Trainer</button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {trainers.map((t) => (
                <div key={t.id} className="bg-white rounded shadow p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.specialization ?? "—"}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingTrainer(t); setShowTrainerForm(true); }} className="px-3 py-1 border rounded">Edit</button>
                    <button onClick={() => deleteTrainer(t.id!)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                  </div>
                </div>
              ))}
              {trainers.length === 0 && <div className="p-6 text-center text-slate-500">No trainers</div>}
            </div>

            {showTrainerForm && (
              <Modal onClose={() => { setShowTrainerForm(false); setEditingTrainer(null); }}>
                <TrainerForm
                  initial={editingTrainer ?? undefined}
                  onCancel={() => { setShowTrainerForm(false); setEditingTrainer(null); }}
                  onSave={async (p) => await saveTrainer(p)}
                />
              </Modal>
            )}
          </section>
        )}

        {/* PAYMENTS */}
        {active === "payments" && (
          <section>
            <h3 className="text-lg font-medium mb-3">Payments</h3>
            <div className="bg-white rounded shadow overflow-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3">Amount</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Method</th>
                    <th className="text-left px-4 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-4">{currency(Number(p.amount))}</td>
                      <td className="px-4 py-4">{p.payment_type}</td>
                      <td className="px-4 py-4">{p.method}</td>
                      <td className="px-4 py-4">{p.timestamp ? new Date(p.timestamp).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-slate-500">No payments</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* CHECKINS */}
        {active === "checkins" && (
          <section>
            <h3 className="text-lg font-medium mb-3">Check-ins (Real)</h3>
            <div className="bg-white rounded shadow overflow-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3">Member ID</th>
                    <th className="text-left px-4 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {checkins.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="px-4 py-4">{c.member_id ?? "-"}</td>
                      <td className="px-4 py-4">{c.timestamp ? new Date(c.timestamp).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
                  {checkins.length === 0 && <tr><td colSpan={2} className="p-6 text-center text-slate-500">No check-ins</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* PASSES */}
        {active === "passes" && (
          <section>
            <h3 className="text-lg font-medium mb-3">Active One-day Passes</h3>
            <div className="bg-white rounded shadow overflow-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3">Booking ID</th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Amount</th>
                    <th className="text-left px-4 py-3">Expires At</th>
                  </tr>
                </thead>
                <tbody>
                  {passes.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-4">{p.id}</td>
                      <td className="px-4 py-4">{p.name}</td>
                      <td className="px-4 py-4">{p.booking_type}</td>
                      <td className="px-4 py-4">{p.amount ? currency(Number(p.amount)) : "-"}</td>
                      <td className="px-4 py-4">{p.expires_at ? new Date(p.expires_at).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
                  {passes.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-500">No active passes</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ANALYTICS */}
        {active === "analytics" && (
          <section>
            <h3 className="text-lg font-medium mb-4">Analytics</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded shadow">
                <div className="text-sm text-slate-600 mb-3">Revenue Breakdown (last 7 days)</div>
                {revenueLast7Days.map((d) => (
                  <div key={d.label} className="flex items-center gap-3 mb-2">
                    <div className="w-28 text-xs text-slate-500">{d.label}</div>
                    <div className="flex-1 bg-slate-100 h-4 rounded overflow-hidden">
                      <div style={{ width: `${(d.amount / Math.max(...revenueLast7Days.map(r => r.amount), 1)) * 100}%` }} className="h-4 bg-orange-400" />
                    </div>
                    <div className="w-20 text-right">{currency(d.amount)}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white rounded shadow">
                <div className="text-sm text-slate-600 mb-3">Quick Stats</div>
                <ul className="space-y-2 text-sm">
                  <li>Total revenue: <strong className="ml-2">{currency(totalRevenue)}</strong></li>
                  <li>Active members: <strong className="ml-2">{activeMembers}</strong></li>
                  <li>Sessions logged: <strong className="ml-2">{sessionsCount}</strong></li>
                  <li>One-day passes (active): <strong className="ml-2">{passesCount}</strong></li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* -------------------------
   Simple Modal
   ------------------------- */
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 z-10">
        <button className="absolute right-3 top-3 text-slate-500" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}
