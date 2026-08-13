import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, ChevronDown, Navigation } from 'lucide-react';
import { CITIES, searchCities } from '@/lib/hospitalData';

interface CitySelectorProps {
  selectedCity: string | null;
  onSelectCity: (city: string) => void;
  compact?: boolean;
}

export function CitySelector({ selectedCity, onSelectCity, compact = false }: CitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(CITIES);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(searchCities(query).slice(0, 10));
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (city: string) => {
    onSelectCity(city);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 ${compact ? 'px-3 py-1.5' : 'px-4 py-2'} rounded-lg bg-slate-50 dark:bg-navy-700/40 border border-slate-200/60 dark:border-white/5 hover:border-accent-400 dark:hover:border-accent-500/30 transition-colors text-sm font-medium text-slate-600 dark:text-navy-200`}
      >
        <Navigation className="w-4 h-4 text-accent-500" />
        <span className={selectedCity ? '' : 'text-slate-400 dark:text-navy-400'}>
          {selectedCity ?? 'Select city'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-navy-800 rounded-xl shadow-float border border-slate-200 dark:border-white/10 overflow-hidden z-50"
          >
            <div className="p-3 border-b border-slate-100 dark:border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  placeholder="Search city..."
                  className="w-full pl-10 pr-3 h-9 rounded-lg bg-slate-50 dark:bg-navy-700/50 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-navy-200 placeholder-slate-400 focus:outline-none focus:border-accent-500"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {results.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleSelect(city.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-navy-700/50 transition-colors text-left ${
                    selectedCity === city.name ? 'bg-accent-50 dark:bg-accent-500/10' : ''
                  }`}
                >
                  <MapPin className="w-4 h-4 text-accent-500 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-700 dark:text-navy-200">{city.name}</div>
                    <div className="text-xs text-slate-400 dark:text-navy-400">{city.state}</div>
                  </div>
                </button>
              ))}
              {results.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-slate-400 dark:text-navy-400">
                  No cities found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
