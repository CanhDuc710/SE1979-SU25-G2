import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const RevenueChart = ({ data }) => (
    <div className="h-80 bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#34d399" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default RevenueChart;
