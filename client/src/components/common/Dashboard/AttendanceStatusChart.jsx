import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const AttendanceStatusChart = ({ data }) => {

    if (!data) return null;

    const STATUS_LABELS = {
        Present: "Có mặt",
        Absent: "Vắng mặt",
        Leave: "Nghỉ phép",
        "Not Specified": "Chưa xác định"
    };

    const chartData = data.attendanceStatusStats?.map(item => ({
        name: STATUS_LABELS[item._id] || item._id,
        value: item.count
    })) || [];

    if (chartData.length === 0) {
        return (
            <div className="bg-white shadow-md rounded-xl p-4 h-full flex items-center justify-center">
                <p className="text-gray-500">
                    Chưa có dữ liệu chấm công
                </p>
            </div>
        );
    }

    const COLORS = [
        "#22c55e", // Present - xanh
        "#ef4444", // Absent - đỏ
        "#3b82f6", // Leave - xanh dương
        "#a1a1aa"  // Not Specified - xám
    ];

    return (
        <div className="bg-white shadow-md rounded-xl p-4 h-full">
            <h2 className="text-lg font-semibold mb-4">
                Thống kê chấm công
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
                    <Tooltip 
                        formatter={(value, name) => [`${value} trường hợp`, name]}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};