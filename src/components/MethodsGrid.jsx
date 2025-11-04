import { Stethoscope, Scissors, Zap, Square } from 'lucide-react';

const items = [
  {
    title: 'Bipo Seler',
    desc: 'Minimal bleeding, quick recovery for many cases.',
    Icon: Stethoscope,
  },
  {
    title: 'Scissors',
    desc: 'Conventional method by experienced practitioners.',
    Icon: Scissors,
  },
  {
    title: 'Laser',
    desc: 'Modern precision with reduced discomfort.',
    Icon: Zap,
  },
  {
    title: 'Clamp',
    desc: 'Neat results with controlled healing process.',
    Icon: Square,
  },
];

export default function MethodsGrid() {
  return (
    <section className="py-10">
      <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6">Choose Your Method</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ title, desc, Icon }) => (
          <div key={title} className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-medium text-blue-800">{title}</h4>
            </div>
            <p className="text-sm text-slate-600 mb-4">{desc}</p>
            <a href="#booking" className="inline-flex items-center text-blue-700 font-medium hover:underline">
              Book Now
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
