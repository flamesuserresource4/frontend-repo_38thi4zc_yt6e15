import { useMemo, useState } from 'react';
import { CalendarDays, Users, Bell } from 'lucide-react';

export default function MantriDashboard({ bookings = [], blockedDates = [], onAddBlockedDate, onRemoveBlockedDate }) {
  const [dateInput, setDateInput] = useState('');

  const upcoming = useMemo(() => {
    const now = new Date();
    return bookings
      .filter((b) => new Date(`${b.date}T${b.time}`) >= now)
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
      .slice(0, 5);
  }, [bookings]);

  return (
    <section className="py-10" id="mantri">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl sm:text-2xl font-semibold">Mantri Dashboard</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-5 h-5 text-blue-700" />
            <h4 className="font-medium text-blue-800">Schedule</h4>
          </div>
          <p className="text-sm text-slate-600 mb-4">View all upcoming bookings at a glance.</p>
          <ul className="space-y-2 max-h-48 overflow-auto pr-1">
            {upcoming.length === 0 && (
              <li className="text-sm text-slate-500">No upcoming appointments.</li>
            )}
            {upcoming.map((b) => (
              <li key={b.id} className="text-sm">
                <span className="font-medium text-blue-700">{b.date}</span> • {b.time} • {b.category}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-blue-700" />
            <h4 className="font-medium text-blue-800">Team</h4>
          </div>
          <p className="text-sm text-slate-600">Manage your practitioners and assignments (preview).</p>
          <div className="mt-3 text-xs text-slate-500">Feature-ready for team management.</div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-blue-700" />
            <h4 className="font-medium text-blue-800">Schedule Reminder</h4>
          </div>
          <p className="text-sm text-slate-600 mb-2">Stay notified about upcoming appointments.</p>
          <ul className="space-y-2 text-sm max-h-48 overflow-auto pr-1">
            {upcoming.map((b) => (
              <li key={b.id} className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{b.date} • {b.time}</div>
                  <div className="text-slate-500">{b.category} — {b.method}</div>
                </div>
              </li>
            ))}
            {upcoming.length === 0 && (
              <li className="text-sm text-slate-500">No reminders at the moment.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-xl border bg-white p-5 shadow-sm">
        <h4 className="font-medium text-blue-800 mb-3">Set Holidays / Blocked Dates</h4>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="border rounded-md px-3 py-2 w-full sm:w-auto"
          />
          <button
            onClick={() => {
              if (dateInput) {
                onAddBlockedDate(dateInput);
                setDateInput('');
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Blocked Date
          </button>
        </div>
        <div className="mt-4">
          <h5 className="text-sm font-medium mb-2">Currently Blocked</h5>
          <div className="flex flex-wrap gap-2">
            {blockedDates.length === 0 && (
              <span className="text-sm text-slate-500">No blocked dates.</span>
            )}
            {blockedDates.map((d) => (
              <span key={d} className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                {d}
                <button onClick={() => onRemoveBlockedDate(d)} className="text-blue-700 hover:text-blue-900">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
