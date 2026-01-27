import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const SalaryChart = ({ balancedata }) => {
    const chartData = []
    if (balancedata && balancedata.balance) {
       
        balancedata.balance.forEach((item) => {
            chartData.push({
                month: item["expensemonth"], 
                SalriesPaid: item["totalexpenses"],
                AvailableAmount: item["availableamount"]
            })
        })
    }

    const chartConfig = {
        AvailableAmount: {
            label: "Số dư khả dụng",
            color: "hsl(var(--chart-1))", 
        },
        SalriesPaid: {
            label: "Lương đã chi trả",
            color: "hsl(var(--chart-2))", 
        },
    }

    let trendingUp = 0
    if (chartData.length >= 2) {
        const prev = chartData[chartData.length - 2].AvailableAmount
        const curr = chartData[chartData.length - 1].AvailableAmount
        if (prev !== 0) {
            trendingUp = Math.round(((curr - prev) * 100) / prev)
        }
    }

    return (
        <div className="flex flex-col h-auto gap-3 salary-container sm:gap-1">
            <div className="px-2 my-2 heading min-[250px]:px-3">
                <h1 className="font-bold min-[250px]:text-xl xl:text-2xl min-[250px]:text-center sm:text-start">Biểu đồ số dư</h1>
            </div>
            <Card className="mx-2 shadow-md salary-chart-card">
                <CardHeader>
                    <CardTitle className="min-[250px]:text-xs sm:text-md md:text-lg lg:text-xl font-bold">
                        Số dư hiện có: {chartData.length > 0 ? chartData[chartData.length - 1].AvailableAmount.toLocaleString('vi-VN') : 0} VNĐ
                    </CardTitle>
                    <CardDescription>Thống kê ngân sách và chi phí lương</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                        <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 10 }}>
                            <defs>
                                <linearGradient id="fillAvailable" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-AvailableAmount)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="var(--color-AvailableAmount)" stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="fillSalaries" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-SalriesPaid)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="var(--color-SalriesPaid)" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                interval="preserveStartEnd" 
                                tickFormatter={(value) => value}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            
                            <Area
                                dataKey="AvailableAmount"
                                type="monotone"
                                fill="url(#fillAvailable)" 
                                stroke="var(--color-AvailableAmount)"
                                strokeWidth={2}
                                stackId="a"
                            />
                            <Area
                                dataKey="SalriesPaid"
                                type="monotone"
                                fill="url(#fillSalaries)"
                                stroke="var(--color-SalriesPaid)"
                                strokeWidth={2}
                                stackId="a"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="pt-4 border-t">
                    <div className="flex items-start w-full gap-2 text-sm">
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                {trendingUp >= 0 ? `Tăng trưởng ${trendingUp}%` : `Giảm ${Math.abs(trendingUp)}%`} so với tháng trước
                                <TrendingUp className={`h-4 w-4 ${trendingUp < 0 ? 'rotate-180 text-red-500' : 'text-green-500'}`} />
                            </div>
                            <p className="text-muted-foreground">
                                Dữ liệu từ {chartData.length > 0 ? chartData[0].month : "..."} đến nay
                            </p>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}