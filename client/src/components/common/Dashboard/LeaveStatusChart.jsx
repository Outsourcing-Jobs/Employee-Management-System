import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const LeaveStatusChart = ({ data }) => {

    if (!data) return null;

    const STATUS_LABELS = {
        Pending: "Chờ duyệt",
        Approved: "Đã duyệt",
        Rejected: "Từ chối"
    };

    const chartData = data.leaveStatusStats?.map(item => ({
        name: STATUS_LABELS[item._id] || item._id,
        value: item.count
    })) || [];

    if (chartData.length === 0) {
        return (
            <div className="bg-white shadow-md rounded-xl p-4 h-full flex items-center justify-center">
                <p className="text-gray-500">
                    Chưa có dữ liệu nghỉ phép
                </p>
            </div>
        );
    }

    const COLORS = ["#facc15", "#22c55e", "#ef4444"];

    return (
        <div className="bg-white shadow-md rounded-xl p-4 h-full">
            <h2 className="text-lg font-semibold mb-4">
                Thống kê trạng thái nghỉ phép
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};