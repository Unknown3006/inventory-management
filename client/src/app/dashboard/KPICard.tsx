import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: "blue" | "green" | "red" | "yellow" | "purple";
}

const colorMap = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
  green: { bg: "bg-green-50", icon: "text-green-600", border: "border-green-200" },
  red: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-200" },
  yellow: { bg: "bg-yellow-50", icon: "text-yellow-600", border: "border-yellow-200" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-200" },
};

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, color }) => {
  const colors = colorMap[color];

  return (
    <div className={`${colors.bg} rounded-lg p-6 border ${colors.border} shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${colors.icon} p-3 bg-white rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
