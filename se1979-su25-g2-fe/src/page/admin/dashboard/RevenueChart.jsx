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
    if (!Array.isArray(data) || data.length === 0) { // Thêm kiểm tra data.length
        return (
            <div className="h-80 flex items-center justify-center bg-white rounded shadow text-red-500">
                Không có dữ liệu để hiển thị biểu đồ doanh thu.
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
                <BarChart
                    data={data}
                    margin={{
                        top: 20, right: 30, left: 20, bottom: 60, // Tăng bottom margin cho XAxis
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="period"
                        tickFormatter={formatXAxisTick}
                        angle={-45} // Xoay nhãn để tránh chồng chéo
                        textAnchor="end" // Neo văn bản ở cuối
                        height={60} // Tăng chiều cao trục X để chứa nhãn xoay
                        interval={0} // Hiển thị tất cả các tick
                    />
                    <YAxis
                        tickFormatter={(value) =>
                            new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                                maximumFractionDigits: 0 // Loại bỏ phần thập phân cho số tiền lớn
                            }).format(value)
                        }
                        domain={[0, 'dataMax']} // Bắt đầu từ 0 và tự động scale
                    />
                    <Tooltip
                        formatter={(value) =>
                            new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                                maximumFractionDigits: 0
                            }).format(value)
                        }
                        labelFormatter={(label) => `Thời gian: ${formatXAxisTick(label)}`}
                    />
                    <Bar dataKey="revenue" fill="#34d399" barSize={30} /> {/* Giảm barSize */}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;