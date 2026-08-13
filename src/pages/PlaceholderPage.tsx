import { Construction } from 'lucide-react';
import type { NavPage } from '@/components/Sidebar';

interface PlaceholderPageProps {
  page: NavPage;
  description: string;
}

export function PlaceholderPage({ page, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-navy-700/60 flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-slate-300 dark:text-navy-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-700 dark:text-navy-200 mb-2">
        {page}
      </h2>
      <p className="text-sm text-slate-400 dark:text-navy-400 max-w-md">
        {description}
      </p>
    </div>
  );
}
