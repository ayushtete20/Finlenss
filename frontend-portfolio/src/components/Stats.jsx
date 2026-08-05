import React from 'react';
import { Award, Briefcase, TrendingUp, Users } from 'lucide-react';

export const Stats = () => {
  const stats = [
    { label: 'Years Advisory Experience', value: '12+', icon: Briefcase },
    { label: 'Institutional Research Papers', value: '150+', icon: Award },
    { label: 'Client Retention Rate', value: '98.5%', icon: Users },
    { label: 'Annualized Alpha Return', value: '+18.4%', icon: TrendingUp },
  ];

  return (
    <section className="py-12 bg-mint-200/60 border-y border-navy-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="mint-card p-6 text-center space-y-2">
                <div className="w-10 h-10 rounded bg-navy-900 text-white flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="block text-3xl font-extrabold text-navy-900 font-serif">{stat.value}</span>
                <span className="text-[11px] text-navy-900/70 uppercase tracking-widest font-bold">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
