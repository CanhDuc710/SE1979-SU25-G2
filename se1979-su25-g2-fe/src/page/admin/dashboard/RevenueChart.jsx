import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const RevenueChart = ({ data }) => {
    if (!Array.isArray(data)) {
        return (
            <div className="h-80 flex items-center justify-center bg-white rounded shadow text-red-500">
                Không có dữ liệu để hiển thị biểu đồ
            </div>
        );
    }

    return (
        <div className="h-80 bg-white p-4 rounded shadow">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis
                        tickFormatter={(value) =>
                            new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND"
                            }).format(value)
                        }
                    />
                    <Tooltip
                        formatter={(value) =>
                            new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND"
                            }).format(value)
                        }
                        labelFormatter={(label) => `Thời gian: ${label}`}
                    />
                    <Bar dataKey="revenue" fill="#34d399" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;
