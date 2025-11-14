// src/components/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { supabase, fetchMembers, fetchTrainers } from '../lib/supabase';

type Member = {
  id: number;
  name: string | null;
  email: string;
  phone?: string | null;
  plan?: string | null;
  status?: string | null;
  age?: number | null;
  gender?: string | null;
  address?: string | null;
  joined_date?: string | null;
  expiry_date?: string | null;
};

type Trainer = {
  id: number;
  name: string | null;
  email: string;
  phone?: string | null;
  specialization?: string | null;
  experience?: string | null;
  certification?: string | null;
  clients?: number | null;
  rating?: number | null;
  salary?: string | null;
  joined_date?: string | null;
};

export default function AdminDashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'trainers'>('members');

  // form state
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [showTrainerForm, setShowTrainerForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

  useEffect(() => {
    reloadAll();
    // subscribe to changes (optional)
    const membersSub = supabase
      .from('members')
      .on('*', () => reloadMembers())
      .subscribe();

    const trainersSub = supabase
      .from('trainers')
      .on('*', () => reloadTrainers())
      .subscribe();

    return () => {
      // remove subs
      // @ts-ignore - supabase types for removeSubscription vary by SDK version
      supabase.removeSubscription?.(membersSub);
      // @ts-ignore
      supabase.removeSubscription?.(trainersSub);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reloadAll() {
    setLoading(true);
    await Promise.all([reloadMembers(), reloadTrainers()]);
    setLoading(false);
  }

  async function reloadMembers() {
    try {
      const data = await fetchMembers();
      setMembers(data as Member[]);
    } catch (err) {
      console.error('Failed to fetch members', err);
    }
  }

  async function reloadTrainers() {
    try {
      const data = await fetchTrainers();
      setTrainers(data as Trainer[]);
    } catch (err) {
      console.error('Failed to fetch trainers', err);
    }
  }

  // Members CRUD
  async function handleSaveMember(payload: Partial<Member>) {
    try {
      if (!payload.name || !payload.email) {
        alert('Name and email required');
        return;
      }
      if (editingMember) {
        // update
        const { error } = await supabase.from('members').update(payload).eq('id', editingMember.id);
        if (error) throw error;
        setEditingMember(null);
        setShowMemberForm(false);
        await reloadMembers();
      } else {
        // insert
        const { error } = await supabase.from('members').insert([payload]);
        if (error) throw error;
        setShowMemberForm(false);
        await reloadMembers();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save member. Check console.');
    }
  }

  async function handleDeleteMember(id: number) {
    if (!confirm('Delete member? This is irreversible.')) return;
    try {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) throw error;
      await reloadMembers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete member');
    }
  }

  // Trainers CRUD
  async function handleSaveTrainer(payload: Partial<Trainer>) {
    try {
      if (!payload.name || !payload.email) {
        alert('Name and email required');
        return;
      }
      if (editingTrainer) {
        const { error } = await supabase.from('trainers').update(payload).eq('id', editingTrainer.id);
        if (error) throw error;
        setEditingTrainer(null);
        setShowTrainerForm(false);
        await reloadTrainers();
      } else {
        const { error } = await supabase.from('trainers').insert([payload]);
        if (error) throw error;
        setShowTrainerForm(false);
        await reloadTrainers();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save trainer');
    }
  }

  async function handleDeleteTrainer(id: number) {
    if (!confirm('Delete trainer? This is irreversible.')) return;
    try {
      const { error } = await supabase.from('trainers').delete().eq('id', id);
      if (error) throw error;
      await reloadTrainers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete trainer');
    }
  }

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AKHADA — Admin Panel</h1>
          <p className="text-sm text-slate-600">Manage members & trainers (live from Supabase)</p>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => { setActiveTab('members'); }}
            className={`px-3 py-2 rounded ${activeTab === 'members' ? 'bg-orange-500 text-white' : 'bg-white border'}`}
          >
            Members ({members.length})
          </button>
          <button
            onClick={() => { setActiveTab('trainers'); }}
            className={`px-3 py-2 rounded ${activeTab === 'trainers' ? 'bg-orange-500 text-white' : 'bg-white border'}`}
          >
            Trainers ({trainers.length})
          </button>
          <button onClick={reloadAll} className="ml-4 px-3 py-2 bg-slate-100 rounded">Refresh</button>
        </div>
      </header>

      {loading && <div className="text-sm text-slate-500 mb-4">Loading...</div>}

      {activeTab === 'members' && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Members Database</h2>
            <div>
              <button onClick={() => { setEditingMember(null); setShowMemberForm(true); }} className="px-4 py-2 bg-green-600 text-white rounded">+ Add Member</button>
            </div>
          </div>

          <div className="bg-white shadow rounded border overflow-hidden">
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
                      <div className="text-xs text-slate-500">{m.age ?? '-'} yrs • {m.gender ?? '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{m.email}</div>
                      <div className="text-xs text-slate-500">{m.phone ?? '-'}</div>
                    </td>
                    <td className="px-4 py-4">{m.plan ?? '-'}</td>
                    <td className="px-4 py-4">{m.status ?? '-'}</td>
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => { setEditingMember(m); setShowMemberForm(true); }} className="px-2 py-1 border rounded mr-2">Edit</button>
                      <button onClick={() => handleDeleteMember(m.id)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && !loading && (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-500">No members found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'trainers' && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Trainers Database</h2>
            <div>
              <button onClick={() => { setEditingTrainer(null); setShowTrainerForm(true); }} className="px-4 py-2 bg-green-600 text-white rounded">+ Add Trainer</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {trainers.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.specialization ?? '—'}</div>
                  <div className="text-xs text-slate-500">{t.email} • {t.phone ?? '-'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingTrainer(t); setShowTrainerForm(true); }} className="px-3 py-1 border rounded">Edit</button>
                  <button onClick={() => handleDeleteTrainer(t.id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                </div>
              </div>
            ))}
            {trainers.length === 0 && !loading && (
              <div className="p-6 text-center text-slate-500">No trainers found</div>
            )}
          </div>
        </section>
      )}

      {/* Member Modal */}
      {showMemberForm && (
        <Modal onClose={() => { setShowMemberForm(false); setEditingMember(null); }}>
          <MemberForm
            initial={editingMember ?? undefined}
            onCancel={() => { setShowMemberForm(false); setEditingMember(null); }}
            onSave={handleSaveMember}
          />
        </Modal>
      )}

      {/* Trainer Modal */}
      {showTrainerForm && (
        <Modal onClose={() => { setShowTrainerForm(false); setEditingTrainer(null); }}>
          <TrainerForm
            initial={editingTrainer ?? undefined}
            onCancel={() => { setShowTrainerForm(false); setEditingTrainer(null); }}
            onSave={handleSaveTrainer}
          />
        </Modal>
      )}
    </div>
  );
}

/* -------------------------
   Small Modal + Forms below
   Replace with your UI libs if you prefer
   ------------------------- */

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
        <button className="absolute right-3 top-3 text-slate-500" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

function MemberForm({ initial, onCancel, onSave }: { initial?: Partial<Member>; onCancel: () => void; onSave: (p: Partial<Member>) => Promise<void> }) {
  const [form, setForm] = useState<Partial<Member>>(initial ?? { name: '', email: '' });

  useEffect(() => setForm(initial ?? { name: '', email: '' }), [initial]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{initial ? 'Edit Member' : 'Add Member'}</h3>
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Full name" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Phone" value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Plan" value={form.plan ?? ''} onChange={(e) => setForm({ ...form, plan: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Status" value={form.status ?? ''} onChange={(e) => setForm({ ...form, status: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Age" type="number" value={form.age ?? ''} onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined })} className="p-2 border rounded" />
        <input placeholder="Gender" value={form.gender ?? ''} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Address" value={form.address ?? ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className="p-2 border rounded col-span-2" />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={() => onSave(form)} className="px-4 py-2 bg-orange-500 text-white rounded">Save</button>
      </div>
    </div>
  );
}

function TrainerForm({ initial, onCancel, onSave }: { initial?: Partial<Trainer>; onCancel: () => void; onSave: (p: Partial<Trainer>) => Promise<void> }) {
  const [form, setForm] = useState<Partial<Trainer>>(initial ?? { name: '', email: '' });

  useEffect(() => setForm(initial ?? { name: '', email: '' }), [initial]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{initial ? 'Edit Trainer' : 'Add Trainer'}</h3>
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Full name" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Phone" value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Specialization" value={form.specialization ?? ''} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Experience" value={form.experience ?? ''} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Certification" value={form.certification ?? ''} onChange={(e) => setForm({ ...form, certification: e.target.value })} className="p-2 border rounded" />
        <input placeholder="Clients" type="number" value={form.clients ?? '' as any} onChange={(e) => setForm({ ...form, clients: e.target.value ? Number(e.target.value) : undefined })} className="p-2 border rounded" />
        <input placeholder="Salary" value={form.salary ?? ''} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="p-2 border rounded" />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={() => onSave(form)} className="px-4 py-2 bg-orange-500 text-white rounded">Save</button>
      </div>
    </div>
  );
}
