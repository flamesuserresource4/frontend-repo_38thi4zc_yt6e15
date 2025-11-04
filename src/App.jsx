import { useMemo, useState } from 'react';
import HeroCarousel from './components/HeroCarousel';
import MethodsGrid from './components/MethodsGrid';
import BookingSection from './components/BookingSection';
import MantriDashboard from './components/MantriDashboard';

function App() {
  const [role, setRole] = useState('public'); // public | customer | mantri
  const [bookings, setBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState(() => {
    // Example: block yesterday to show behavior
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return [];
  });

  const onCreateBooking = (b) => setBookings((prev) => [...prev, b]);
  const onCancelBooking = (id) => setBookings((prev) => prev.filter((b) => b.id !== id));

  const onAddBlockedDate = (d) => setBlockedDates((prev) => (prev.includes(d) ? prev : [...prev, d]));
  const onRemoveBlockedDate = (d) => setBlockedDates((prev) => prev.filter((x) => x !== d));

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return bookings.filter((b) => new Date(`${b.date}T${b.time}`) >= now).length;
  }, [bookings]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#top" className="font-semibold text-blue-700 text-lg">CircumCare</a>
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setRole('public')}
              className={`px-3 py-1.5 rounded-md border ${role === 'public' ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-slate-50'}`}
            >
              Public
            </button>
            <button
              onClick={() => setRole('customer')}
              className={`px-3 py-1.5 rounded-md border ${role === 'customer' ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-slate-50'}`}
            >
              Customer
            </button>
            <button
              onClick={() => setRole('mantri')}
              className={`px-3 py-1.5 rounded-md border ${role === 'mantri' ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-slate-50'}`}
            >
              Mantri
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4">
        <div className="py-6" />
        <HeroCarousel />
        <MethodsGrid />

        {(role === 'public' || role === 'customer') && (
          <BookingSection
            bookings={bookings}
            onCreateBooking={onCreateBooking}
            onCancelBooking={onCancelBooking}
            blockedDates={blockedDates}
          />
        )}

        {(role === 'public' || role === 'mantri') && (
          <MantriDashboard
            bookings={bookings}
            blockedDates={blockedDates}
            onAddBlockedDate={onAddBlockedDate}
            onRemoveBlockedDate={onRemoveBlockedDate}
          />
        )}

        <footer className="py-10 text-center text-sm text-slate-500">
          <div className="mb-2">© {new Date().getFullYear()} CircumCare</div>
          <div>Upcoming appointments: {upcomingCount}</div>
        </footer>
      </main>
    </div>
  );
}

export default App;
