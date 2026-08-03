import React from 'react';
import { Utensils, Flame, Leaf, Award, HeartHandshake } from 'lucide-react';

interface CuisineFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedFilter: 'all' | 'veg' | 'topRated';
  onFilterChange: (filter: 'all' | 'veg' | 'topRated') => void;
}

const CATEGORIES = [
  { id: 'All', label: 'All Cuisines', icon: '🍽️' },
  { id: 'South Indian', label: 'South Indian', icon: '🥞' },
  { id: 'Biryani', label: 'Biryani', icon: '🍲' },
  { id: 'North Indian', label: 'North Indian', icon: '🫓' },
  { id: 'Mughlai', label: 'Mughlai & Kebabs', icon: '🍢' },
  { id: 'Pure Veg', label: 'Pure Veg', icon: '🥗' },
  { id: 'Andhra', label: 'Andhra Spiced', icon: '🌶️' },
  { id: 'Desserts', label: 'Desserts & Ice Cream', icon: '🍨' },
  { id: 'Burgers', label: 'Burgers & Fast Food', icon: '🍔' },
];

export const CuisineFilter: React.FC<CuisineFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Primary Toggles & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none max-w-full">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-rose-500/20 shadow-md scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm shrink-0">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('veg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'veg'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Veg Only</span>
          </button>
          <button
            onClick={() => onFilterChange('topRated')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'topRated'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>4.5+ Rating</span>
          </button>
        </div>

      </div>
    </div>
  );
};
