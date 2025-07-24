import React from "react";
import {
    BarChart, // Hoặc LineChart nếu bạn muốn biểu đồ đường
    Bar,      // Hoặc Line
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const OrdersChart = ({ data }) => {
    if (!Array.isArray(data) || data.length === 0) { // Thêm kiểm tra data.length
        return (
            <div className="h-80 flex items-center justify-center bg-white rounded shadow text-red-500">
                Không có dữ liệu đơn hàng để hiển thị.
            </div>
        );
    }

    const formatXAxisTick = (tick) => {
        if (tick.includes('-')) { // Monthly data (e.g., "YYYY-MM")
            const [year, month] = tick.split('-');
            return `Thg ${month}/${year}`; // Ví dụ: "Thg 01/2025"
        }
        return `Năm ${tick}`; // Yearly data (e.g., "2025")
    };

    return (
        <div className="h-80 bg-white p-4 rounded shadow">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart // Hoặc LineChart
                    data={data}
                    margin={{
                        top: 20, right: 30, left: 20, bottom: 60, // Tăng bottom margin cho XAxis
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="period"
                        tickFormatter={formatXAxisTick}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0} // Hiển thị tất cả các tick
                    />
                    <YAxis
                        allowDecimals={false} // Đảm bảo trục Y là số nguyên
                        domain={[0, 'dataMax']} // Bắt đầu từ 0 và tự động scale
                    />
                    <Tooltip
                        formatter={(value) => [value, "Đơn hàng"]}
                        labelFormatter={(label) => `Thời gian: ${formatXAxisTick(label)}`}
                    />
                    <Bar dataKey="orderCount" fill="#3b82f6" barSize={30} /> {/* Giảm barSize */}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrdersChart;