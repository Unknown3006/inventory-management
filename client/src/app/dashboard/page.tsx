"use client";

import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Layers,
} from "lucide-react";
import { useGetProductsQuery, useGetDashboardMetricsQuery } from "@/state/api";
import CardExpenseSummary from "./CardExpenseSummary";
import CardPopularProducts from "./CardPopularProducts";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";
import KPICard from "./KPICard";

const Dashboard = () => {
  const { data: products } = useGetProductsQuery();
  const { data: metrics } = useGetDashboardMetricsQuery();

  // Calculate KPI metrics
  const totalProducts = products?.length || 0;
  const lowStockItems = products?.filter((p) => p.stockQuantity < 10).length || 0;
  const totalRevenue = products?.reduce(
    (sum, p) => sum + p.price * p.stockQuantity,
    0
  ) || 0;
  const salesValue: number = metrics?.salesSummary?.[0]?.totalValue ?? 0;

  return (
    <div className="flex flex-col gap-8">
      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="blue"
        />
        <KPICard
          title="Total Inventory Value"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="Low Stock Items"
          value={lowStockItems}
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          title="Total Sales Value"
          value={`$${salesValue.toFixed(2)}`}
          icon={Layers}
          color="purple"
        />
      </div>

      {/* EXISTING DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
        <CardPopularProducts />
        <CardSalesSummary />
        <CardPurchaseSummary />
        <CardExpenseSummary />
        <StatCard
          title="Customer & Expenses"
          primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
          dateRange="22 - 29 October 2023"
          details={[
            {
              title: "Customer Growth",
              amount: "175.00",
              changePercentage: 131,
              IconComponent: TrendingUp,
            },
            {
              title: "Expenses",
              amount: "10.00",
              changePercentage: -56,
              IconComponent: TrendingDown,
            },
          ]}
        />
        <StatCard
          title="Dues & Pending Orders"
          primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
          dateRange="22 - 29 October 2023"
          details={[
            {
              title: "Dues",
              amount: "250.00",
              changePercentage: 131,
              IconComponent: TrendingUp,
            },
            {
              title: "Pending Orders",
              amount: "147",
              changePercentage: -56,
              IconComponent: TrendingDown,
            },
          ]}
        />
        <StatCard
          title="Sales & Discount"
          primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
          dateRange="22 - 29 October 2023"
          details={[
            {
              title: "Sales",
              amount: "1000.00",
              changePercentage: 20,
              IconComponent: TrendingUp,
            },
            {
              title: "Discount",
              amount: "200.00",
              changePercentage: -10,
              IconComponent: TrendingDown,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Dashboard;
