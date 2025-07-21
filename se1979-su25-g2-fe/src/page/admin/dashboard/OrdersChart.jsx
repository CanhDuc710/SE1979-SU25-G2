import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const OrdersChart = ({ data }) => {
    if (!Array.isArray(data)) {
        return (
            <div className="h-80 flex items-center justify-center bg-white rounded shadow text-red-500">
                Không có dữ liệu đơn hàng để hiển thị
            </div>
        );
    }

    return (
        <div className="h-80 bg-white p-4 rounded shadow">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, "Đơn hàng"]} />
                    <Line type="monotone" dataKey="orderCount" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrdersChart;
