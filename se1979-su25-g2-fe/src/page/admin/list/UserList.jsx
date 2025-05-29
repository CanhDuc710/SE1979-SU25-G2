import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { FaEye, FaBan, FaCheckCircle } from "react-icons/fa";

export default function UserList() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const users = [
        { id: 1, username: "user1", email: "user1@example.com", status: "ACTIVE" },
        { id: 2, username: "user2", email: "user2@example.com", status: "ACTIVE" },
        { id: 3, username: "user3", email: "user3@example.com", status: "ACTIVE" },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Sidebar */}
            <div
                className={`transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} flex-shrink-0`}
            >
                <Sidebar
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <div className="bg-white p-4 rounded shadow-md mb-4">
                    <input
                        type="text"
                        placeholder="🔍  Search user ..."
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div className="overflow-x-auto rounded shadow-md">
                    <table className="min-w-full text-sm bg-white rounded">
                        <thead className="bg-gradient-to-r from-blue-100 to-yellow-100 text-gray-700 text-left">
                        <tr>
                            <th className="px-4 py-3">Username</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-2 flex items-center gap-2">
                                    <img
                                        src="https://via.placeholder.com/30"
                                        className="rounded-full w-8 h-8"
                                        alt="avatar"
                                    />
                                    <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                      {user.username}
                    </span>
                                </td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <FaCheckCircle /> {user.status}
                    </span>
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                    <button className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">
                                        <FaEye />
                                    </button>
                                    <button className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200">
                                        <FaBan />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                    Display 1 to {users.length} in total {users.length} users
                </div>
            </div>
        </div>
    );
}
