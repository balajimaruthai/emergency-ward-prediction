import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Radio,
  Brain,
  TrendingUp,
  BarChart3,
  Boxes,
  Cpu,
  FileText,
  MoreHorizontal,
  Activity,
  ChevronLeft,
} from 'lucide-react';

export type NavPage =
  | 'Overview'
  | 'Live Monitoring'
  | 'Prediction'
  | 'Forecast'
  | 'Analytics'
  | 'Resources'
  | 'Model'
  | 'Reports'
  | 'Explainability'
  | 'Data Management'
  | 'System Health'
  | 'Settings';

interface SidebarProps {
  current: NavPage;
  onNavigate: (page: NavPage) => void;
}

const PRIMARY_ITEMS: { label: NavPage; icon: typeof LayoutDashboard }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Live Monitoring', icon: Radio },
  { label: 'Prediction', icon: Brain },
  { label: 'Forecast', icon: TrendingUp },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Resources', icon: Boxes },
  { label: 'Model', icon: Cpu },
  { label: 'Reports', icon: FileText },
];

const MORE_ITEMS: NavPage[] = [
  'Explainability',
  'Data Management',
  'System Health',
  'Settings',
];

export function Sidebar({ current, onNavigate }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const width = expanded ? 220 : 72;
  const isMoreActive = MORE_ITEMS.includes(current);

  return (
    <motion.aside
      animate={{ width }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        setMoreOpen(false);
      }}
      className="fixed left-0 top-0 bottom-0 z-30 glass border-r border-slate-200/60 dark:border-white/5 flex flex-col py-4 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center px-4 mb-6 h-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="ml-3 min-w-0"
            >
              <div className="text-sm font-bold text-slate-800 dark:text-navy-100 leading-tight">EWI</div>
              <div className="text-[10px] text-slate-400 dark:text-navy-400 leading-tight">Emergency Ward Intelligence</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 px-2 space-y-1">
        {PRIMARY_ITEMS.map((item) => {
          const isActive = current === item.label;
          return (
            <NavButton
              key={item.label}
              label={item.label}
              icon={item.icon}
              active={isActive}
              expanded={expanded}
              onClick={() => onNavigate(item.label)}
            />
          );
        })}

        {/* More */}
        <div className="relative">
          <NavButton
            label="More"
            icon={MoreHorizontal}
            active={isMoreActive}
            expanded={expanded}
            onClick={() => setMoreOpen((v) => !v)}
            chevronOpen={moreOpen}
          />
          <AnimatePresence>
            {moreOpen && expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden ml-3 mt-1 space-y-1"
              >
                {MORE_ITEMS.map((label) => (
                  <button
                    key={label}
                    onClick={() => onNavigate(label)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      current === label
                        ? 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-500/10 font-medium'
                        : 'text-slate-500 dark:text-navy-400 hover:text-slate-700 dark:hover:text-navy-200 hover:bg-slate-50 dark:hover:bg-navy-700/40'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Collapse hint */}
      <div className="px-4 pt-4">
        <div
          className={`flex items-center gap-2 text-xs text-slate-300 dark:text-navy-500 ${
            expanded ? 'justify-end' : 'justify-center'
          }`}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${expanded ? '' : 'rotate-180'}`} />
          {expanded && <span>Hover to collapse</span>}
        </div>
      </div>
    </motion.aside>
  );
}

function NavButton({
  label,
  icon: Icon,
  active,
  expanded,
  onClick,
  chevronOpen,
}: {
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
  chevronOpen?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 h-11 rounded-xl transition-all duration-200 relative ${
        active
          ? 'text-accent-600 dark:text-accent-400'
          : 'text-slate-400 dark:text-navy-400 hover:text-slate-600 dark:hover:text-navy-200'
      }`}
    >
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute inset-0 rounded-xl bg-accent-50 dark:bg-accent-500/10"
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        />
      )}
      <Icon className="w-5 h-5 shrink-0 relative z-10" />
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="text-sm font-medium relative z-10 flex-1 text-left whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {chevronOpen !== undefined && expanded && (
        <ChevronLeft
          className={`w-4 h-4 relative z-10 transition-transform ${chevronOpen ? '-rotate-90' : ''}`}
        />
      )}
    </button>
  );
}
