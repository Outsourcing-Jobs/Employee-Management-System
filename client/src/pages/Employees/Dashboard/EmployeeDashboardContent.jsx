import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HandleGetReportDashboardEmployee } from "../../../redux/Thunks/DashboardThunk";
import {
  TrendingUp,
  CalendarDays,
  ClipboardList,
  Banknote,
  UserCheck,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loading } from "../../../components/common/loading";

const MONTH_LABELS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

// Bản đồ trạng thái sang tiếng Việt
const STATUS_TRANSLATION = {
  Approved: "Đã duyệt",
  Rejected: "Từ chối",
  Pending: "Đang chờ",
};

const STATUS_COLOR_MAP = {
  Approved: "#3266ad",
  Rejected: "#E24B4A",
  Pending: "#EF9F27",
};

const FALLBACK_COLORS = ["#73726c", "#3266ad", "#1D9E75", "#7F77DD"];

// ── Metric card (Thẻ chỉ số) ───────────────────────────────────────
const MetricCard = ({ label, value, icon: Icon, color }) => (
  <Card
    style={{
      background: color + "10", // nền nhạt theo màu icon
      border: "none",
    }}
  >
    <CardContent className="pt-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-medium">{value ?? 0}</p>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: color + "20" }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </CardContent>
  </Card>
);

// ── Custom legend (Chú giải tùy chỉnh) ─────────────────────────────
const CustomLegend = ({ items }) => (
  <div className="flex flex-wrap gap-3 mt-3">
    {items.map((item) => (
      <span
        key={item.label}
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <span
          className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
          style={{ background: item.color }}
        />
        {item.label}
      </span>
    ))}
  </div>
);

// ── Donut label in center (Nhãn giữa biểu đồ tròn) ─────────────────
const DonutCenter = ({ total, label }) => (
  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
    <tspan x="50%" dy="-6" fontSize="22" fontWeight="500" fill="currentColor">
      {total}
    </tspan>
    <tspan x="50%" dy="18" fontSize="11" fill="#888780">
      {label}
    </tspan>
  </text>
);

// ── Salary formatter (Định dạng lương) ──────────────────────────────
const fmtVND = (v) => (v / 1_000_000).toFixed(1) + "tr";

const EmployeeDashboardContent = () => {
  const dispatch = useDispatch();
  const DashboardState = useSelector((state) => state.dashboardreducer);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    dispatch(HandleGetReportDashboardEmployee(currentYear));
  }, [dispatch]);

  if (DashboardState.isLoading) return <Loading />;

  const counts = DashboardState?.reportDashboardEmployee?.counts ?? {};
  const charts = DashboardState?.reportDashboardEmployee?.charts ?? {};

  const leaveStats = charts.leaveStats ?? [];
  const requestStats = charts.requestStats ?? [];
  const attendanceStats = charts.attendanceStats ?? [];
  const salaryChart = charts.salaryChart ?? [];

  const leaveTotal = leaveStats.reduce((a, b) => a + b.count, 0);
  const requestTotal = requestStats.reduce((a, b) => a + b.count, 0);
  const attendanceTotal = attendanceStats.reduce((a, b) => a + b.count, 0);

  const salaryData = salaryChart.map((s) => ({
    month: MONTH_LABELS[(s._id ?? 1) - 1],
    salary: s.totalSalary,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* ── Tiêu đề ── */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#042C53] flex items-center justify-center">
          <TrendingUp size={18} className="text-[#E6F1FB]" />
        </div>
        <div>
          <h1 className="text-xl font-medium">Tổng quan nhân viên</h1>
          <p className="text-sm text-muted-foreground">
            Dữ liệu năm {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* ── Thẻ chỉ số metric ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Tổng chấm công"
          value={counts.totalAttendance}
          icon={UserCheck}
          color="#3266ad"
        />
        <MetricCard
          label="Tổng đơn nghỉ phép"
          value={counts.totalLeaves}
          icon={CalendarDays}
          color="#E24B4A"
        />
        <MetricCard
          label="Tổng yêu cầu"
          value={counts.totalRequests}
          icon={ClipboardList}
          color="#EF9F27"
        />
        <MetricCard
          label="Bản ghi lương"
          value={counts.totalSalary}
          icon={Banknote}
          color="#1D9E75"
        />
      </div>

      {/* ── Hàng 1: Biểu đồ Nghỉ phép + Yêu cầu ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trạng thái nghỉ phép */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Trạng thái nghỉ phép
            </CardTitle>
            <CardDescription>Phân bổ theo tình trạng phê duyệt</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={leaveStats}
                  dataKey="count"
                  nameKey="_id"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {leaveStats.map((s) => (
                    <Cell
                      key={s._id}
                      fill={STATUS_COLOR_MAP[s._id] ?? "#73726c"}
                    />
                  ))}
                  <DonutCenter total={leaveTotal} label="tổng đơn" />
                </Pie>
                <Tooltip
                  formatter={(v, name) => [v, STATUS_TRANSLATION[name] || name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <CustomLegend
              items={leaveStats.map((s) => ({
                label: `${STATUS_TRANSLATION[s._id] || s._id} — ${s.count}`,
                color: STATUS_COLOR_MAP[s._id] ?? "#73726c",
              }))}
            />
          </CardContent>
        </Card>

        {/* Trạng thái yêu cầu */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Trạng thái yêu cầu
            </CardTitle>
            <CardDescription>Các yêu cầu đang xử lý</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={requestStats}
                  dataKey="count"
                  nameKey="_id"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {requestStats.map((s) => (
                    <Cell
                      key={s._id}
                      fill={STATUS_COLOR_MAP[s._id] ?? "#EF9F27"}
                    />
                  ))}
                  <DonutCenter total={requestTotal} label="tổng yêu cầu" />
                </Pie>
                <Tooltip
                  formatter={(v, name) => [v, STATUS_TRANSLATION[name] || name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <CustomLegend
              items={requestStats.map((s) => ({
                label: `${STATUS_TRANSLATION[s._id] || s._id} — ${s.count}`,
                color: STATUS_COLOR_MAP[s._id] ?? "#EF9F27",
              }))}
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Hàng 2: Chấm công + Biểu đồ Lương ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chấm công */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tình trạng chấm công
            </CardTitle>
            <CardDescription>Phân tích theo loại hình ghi nhận</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={attendanceStats}
                  dataKey="count"
                  nameKey="_id"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {attendanceStats.map((s, i) => (
                    <Cell
                      key={s._id}
                      fill={FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                    />
                  ))}
                  <DonutCenter total={attendanceTotal} label="tổng ghi nhận" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <CustomLegend
              items={attendanceStats.map((s, i) => ({
                label: `${s._id} — ${s.count}`,
                color: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
              }))}
            />
          </CardContent>
        </Card>

        {/* Biểu đồ lương */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng quan thu nhập
            </CardTitle>
            <CardDescription>Tổng lương theo từng tháng (VND)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={salaryData}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(136,135,128,0.15)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#888780" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={fmtVND}
                  tick={{ fontSize: 11, fill: "#888780" }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  formatter={(v) => [
                    new Intl.NumberFormat("vi-VN").format(v) + " ₫",
                    "Tiền lương",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "0.5px solid rgba(0,0,0,0.12)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="salary" fill="#3266ad" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboardContent;
