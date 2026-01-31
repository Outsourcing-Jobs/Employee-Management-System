const StatCard = ({ icon, label, value, color }) => (
    <div className="flex items-center gap-4 p-5 bg-white border shadow-sm rounded-2xl border-slate-100">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );

export default StatCard