import React, { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Package } from "lucide-react";
import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [revenueType, setRevenueType] = useState("monthly");
    const [ordersType, setOrdersType] = useState("monthly");

    // Fetch main metrics
    useEffect(() => {
        fetch("http://localhost:8080/api/dashboard/metrics")
            .then((res) => res.json())
            .then((data) => setMetrics(data));
    }, []);

    // Fetch revenue chart
    useEffect(() => {
        fetch(`http://localhost:8080/api/dashboard/revenue?type=${revenueType}`)
            .then((res) => res.json())
            .then((data) => setRevenueData(data));
    }, [revenueType]);

    // Fetch completed orders chart
    useEffect(() => {
        fetch(`http://localhost:8080/api/dashboard/completed-orders?type=${ordersType}`)
            .then((res) => res.json())
            .then((data) => setOrdersData(data));
    }, [ordersType]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Thống kê cửa hàng</h1>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <MetricCard
                    icon={<DollarSign className="w-5 h-5 text-white" />}
                    title="Doanh thu tháng"
                    value={metrics?.monthlyRevenue?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND"
                    })}
                    bgColor="bg-green-500"
                />
                <MetricCard
                    icon={<ShoppingCart className="w-5 h-5 text-white" />}
                    title="Đơn hàng tháng"
                    value={metrics?.monthlyConfirmedOrders?.toLocaleString()}
                    bgColor="bg-blue-500"
                />
                <MetricCard
                    icon={<Package className="w-5 h-5 text-white" />}
                    title="Sản phẩm đang bán"
                    value={metrics?.activeProductsCount?.toLocaleString()}
                    bgColor="bg-purple-500"
                />
            </div>

            {/* Chart controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold text-lg">Doanh thu theo {revenueType}</h2>
                        <select value={revenueType} onChange={(e) => setRevenueType(e.target.value)} className="border p-1 rounded">
                            <option value="monthly">Theo tháng</option>
                            <option value="yearly">Theo năm</option>
                        </select>
                    </div>
                    <RevenueChart data={revenueData} />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold text-lg">Đơn hàng hoàn thành theo {ordersType}</h2>
                        <select value={ordersType} onChange={(e) => setOrdersType(e.target.value)} className="border p-1 rounded">
                            <option value="monthly">Theo tháng</option>
                            <option value="yearly">Theo năm</option>
                        </select>
                    </div>
                    <OrdersChart data={ordersData} />
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ icon, title, value, bgColor }) => (
    <div className={`flex items-center p-4 rounded shadow text-white ${bgColor}`}>
        <div className="p-2 rounded bg-white bg-opacity-20 mr-4">
            {icon}
        </div>
        <div>
            <div className="text-sm">{title}</div>
            <div className="text-xl font-bold">{value || "—"}</div>
        </div>
    </div>
);

export default Dashboard;
