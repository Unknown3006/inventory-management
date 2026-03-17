import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: "blue" | "green" | "red" | "yellow" | "purple";
}

const colorMap = {
  blue: { bg: "bg-blue-50 dark:bg-blue-900/30", icon: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  green: { bg: "bg-green-50 dark:bg-green-900/30", icon: "text-green-600 dark:text-green-400", border: "border-green-200 dark:border-green-800" },
  red: { bg: "bg-red-50 dark:bg-red-900/30", icon: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-900/30", icon: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800" },
  purple: { bg: "bg-purple-50 dark:bg-purple-900/30", icon: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
};

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, color }) => {
  const colors = colorMap[color];

  return (
    <div className={`${colors.bg} rounded-lg p-6 border ${colors.border} shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
        <div className={`${colors.icon} p-3 bg-white dark:bg-gray-800 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
