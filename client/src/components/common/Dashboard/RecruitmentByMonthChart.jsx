import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

export const RecruitmentByMonthChart = ({ data }) => {

    if (!data || !data.recruitment?.byMonth) {
        return (
            <div className="bg-white rounded-xl shadow p-4">
                Không có dữ liệu
            </div>
        )
    }

    const formattedData = data.recruitment.byMonth.map(item => ({
        month: `Tháng ${item._id}`,
        count: item.count
    }))

    return (
        <div className="bg-white rounded-xl shadow p-4 h-[400px]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Số Tin Tuyển Dụng Theo Tháng
            </h2>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData}>
                    
                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    
                    <XAxis 
                        dataKey="month" 
                        stroke="#6b7280"
                    />
                    
                    <YAxis 
                        stroke="#6b7280"
                    />

                    <Tooltip 
                        contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb"
                        }}
                    />

                    <Bar 
                        dataKey="count" 
                        fill="#3b82f6"   // 🔵 xanh dương
                        radius={[6,6,0,0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}