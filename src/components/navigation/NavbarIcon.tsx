import { LucideIcon } from 'lucide-react';

interface NavbarIconProps {
  icon: LucideIcon;
  count?: number;
  isActive?: boolean;
}

export function NavbarIcon({ icon: Icon, count, isActive }: NavbarIconProps) {
  return (
    <div className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-700'}`} />
      {typeof count !== 'undefined' && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
          {count}
        </span>
      )}
    </div>
  );
}