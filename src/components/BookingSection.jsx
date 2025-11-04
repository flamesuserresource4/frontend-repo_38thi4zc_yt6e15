import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, MapPin, Calendar, Clock } from 'lucide-react';

const CATEGORIES = ['Baby Circumcision', 'Kids Circumcision', 'Teen Circumcision', 'Revision Circumcision'];
const METHODS = ['Bipo Seler', 'Scissors', 'Laser', 'Clamp'];
const TIME_SLOTS = ['09:00', '11:00', '13:00', '15:00'];

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function BookingSection({ bookings, onCreateBooking, onCancelBooking, blockedDates }) {
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [method, setMethod] = useState(METHODS[0]);
  const [address, setAddress] = useState('');
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [toast, setToast] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthDays = useMemo(() => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const days = [];
    for (let d = 1; d <= end.getDate(); d++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), d));
    }
    return days;
  }, [month]);

  const bookingsByDate = useMemo(() => {
    const map = new Map();
    for (const b of bookings) {
      if (!map.has(b.date)) map.set(b.date, []);
      map.get(b.date).push(b);
    }
    return map;
  }, [bookings]);

  const blockedSet = useMemo(() => new Set(blockedDates), [blockedDates]);

  const availableTimes = useMemo(() => {
    if (!selectedDate) return TIME_SLOTS;
    const key = formatDateKey(selectedDate);
    const taken = new Set((bookingsByDate.get(key) || []).map((b) => b.time));
    return TIME_SLOTS.filter((t) => !taken.has(t));
  }, [selectedDate, bookingsByDate]);

  useEffect(() => {
    if (availableTimes.length > 0) setTime(availableTimes[0]);
  }, [availableTimes]);

  function isDisabledDay(d) {
    const key = formatDateKey(d);
    const full = (bookingsByDate.get(key) || []).length >= TIME_SLOTS.length;
    return d < today || blockedSet.has(key) || full;
  }

  function handleBook(e) {
    e.preventDefault();
    if (!selectedDate) return;
    const key = formatDateKey(selectedDate);
    const booking = {
      id: `${Date.now()}`,
      date: key,
      time,
      category,
      method,
      address,
    };
    onCreateBooking(booking);
    setToast({ type: 'success', message: 'Booking confirmed!' });
    setAddress('');
  }

  function canCancel(b) {
    const appt = new Date(`${b.date}T${b.time}`);
    const h3 = new Date(appt);
    h3.setDate(h3.getDate() - 3);
    return new Date() <= h3;
  }

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const weeksPrefix = new Date(month.getFullYear(), month.getMonth(), 1).getDay();

  return (
    <section id="booking" className="py-10">
      <h3 className="text-xl sm:text-2xl font-semibold mb-6">Book Your Appointment</h3>
      {toast && (
        <div className={`mb-4 flex items-center gap-2 rounded-md px-4 py-3 text-sm ${
          toast.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          {toast.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-medium text-blue-800">
                  <Calendar className="w-4 h-4" />
                  {month.toLocaleString('default', { month: 'long' })} {month.getFullYear()}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                    className="px-2 py-1 rounded border hover:bg-slate-50"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                    className="px-2 py-1 rounded border hover:bg-slate-50"
                  >
                    ›
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-1">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: weeksPrefix }).map((_, i) => (
                  <div key={`p-${i}`} className="h-10" />
                ))}
                {monthDays.map((d) => {
                  const key = formatDateKey(d);
                  const disabled = isDisabledDay(d);
                  const bookedCount = (bookingsByDate.get(key) || []).length;
                  const isSelected = selectedDate && sameDay(selectedDate, d);
                  return (
                    <button
                      key={key}
                      disabled={disabled}
                      onClick={() => setSelectedDate(d)}
                      className={`h-10 rounded-md text-sm relative border ${
                        isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-blue-50 border-slate-200'
                      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {d.getDate()}
                      {bookedCount > 0 && (
                        <span className={`absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                          bookedCount >= TIME_SLOTS.length ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {bookedCount}/{TIME_SLOTS.length}
                        </span>
                      )}
                      {blockedSet.has(key) && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-red-600">Blocked</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-md px-3 py-2">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full border rounded-md px-3 py-2">
                  {METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Destination Address</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, district, city"
                      className="w-full pl-9 border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-9 border rounded-md px-3 py-2"
                    disabled={!selectedDate || availableTimes.length === 0}
                    required
                  >
                    {availableTimes.length === 0 ? (
                      <option>No times available</option>
                    ) : (
                      availableTimes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedDate || availableTimes.length === 0}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Book Now
              </button>
            </form>
          </div>
          <p className="text-xs text-slate-500 mt-3">Note: You can cancel up to 3 days before the appointment.</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h4 className="font-medium text-blue-800 mb-3">My Bookings</h4>
          <ul className="space-y-3">
            {bookings.length === 0 && (
              <li className="text-sm text-slate-500">No bookings yet.</li>
            )}
            {bookings.map((b) => (
              <li key={b.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.date} • {b.time}</div>
                    <div className="text-sm text-slate-600">{b.category} — {b.method}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[220px]">{b.address}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => {
                        if (canCancel(b)) {
                          onCancelBooking(b.id);
                          setToast({ type: 'info', message: 'Booking cancelled.' });
                        }
                      }}
                      disabled={!canCancel(b)}
                      className="text-red-600 hover:text-red-700 disabled:opacity-40"
                    >
                      Cancel
                    </button>
                    {!canCancel(b) && (
                      <span className="text-[10px] text-slate-500">Cancellation closed (H-3)</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
