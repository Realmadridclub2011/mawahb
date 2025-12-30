import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor: string;
  iconBg: string;
}

export function StatCard({ icon: Icon, value, label, iconColor, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex flex-col items-center text-center">
        <div className={`${iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-3`}>
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
}

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  bgGradient: string;
  iconColor: string;
  onClick?: () => void;
}

export function CategoryCard({ icon: Icon, title, bgGradient, iconColor, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${bgGradient} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all w-full text-right group`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`bg-white/30 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
    </button>
  );
}

interface HeroCardProps {
  title: string;
  subtitle: string;
  status: string;
  icon: LucideIcon;
}

export function HeroCard({ title, subtitle, status, icon: Icon }: HeroCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#8D1B3D] to-[#A52A4A] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 text-right">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-white/90 text-sm leading-relaxed">{subtitle}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <Icon className="w-8 h-8" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <span className="text-sm text-white/80">مستوى النشاط:</span>
          <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
