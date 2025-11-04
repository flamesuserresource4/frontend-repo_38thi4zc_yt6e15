import { useEffect, useState } from 'react';
import { Heart, Shield, Sparkles } from 'lucide-react';

const slides = [
  {
    title: 'Safe, Gentle, Professional',
    subtitle: 'Trusted circumcision service at your doorstep',
    Icon: Shield,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    title: 'Loved by Families',
    subtitle: 'Comfort-focused methods for all ages',
    Icon: Heart,
    color: 'from-sky-600 to-blue-700',
  },
  {
    title: 'Modern Techniques',
    subtitle: 'Choose Laser, Clamp, Scissors, or Bipo Seler',
    Icon: Sparkles,
    color: 'from-indigo-600 to-blue-800',
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full overflow-hidden">
      <div className="relative h-[260px] sm:h-[360px] md:h-[440px] rounded-xl bg-gradient-to-r shadow-lg text-white">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            } bg-gradient-to-r ${s.color} flex items-center justify-center text-center px-6`}
          >
            <div className="max-w-3xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <s.Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                  {s.title}
                </h2>
              </div>
              <p className="text-sm sm:text-base md:text-lg/relaxed opacity-90">
                {s.subtitle}
              </p>
              <div className="mt-6">
                <a
                  href="#booking"
                  className="inline-block bg-white text-blue-700 font-medium px-5 py-2 rounded-full shadow hover:bg-blue-50 transition"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
