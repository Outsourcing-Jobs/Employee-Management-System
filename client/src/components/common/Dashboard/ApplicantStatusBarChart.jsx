import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

export const ApplicantStatusBarChart = ({ data }) => {

    if (!data || !data.applicant?.byStatus) {
        return (
            <div className="bg-white rounded-xl shadow p-4">
                Không có dữ liệu
            </div>
        )
    }

    const formattedData = data.applicant.byStatus.map(item => ({
        status: item._id,
        count: item.count
    }))

    return (
        <div className="bg-white rounded-xl shadow p-4 h-[400px]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Ứng Viên Theo Trạng Thái
            </h2>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData}>

                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    
                    <XAxis 
                        dataKey="status" 
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
                        fill="#10b981"   // 🟢 xanh lá
                        radius={[6,6,0,0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}