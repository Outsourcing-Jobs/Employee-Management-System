import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleGetMyNotices } from "../../../redux/Thunks/NoticeThunk";
import { 
    Bell, Search, Calendar, ChevronRight, 
    Inbox, Info, AlertCircle, RefreshCcw 
} from "lucide-react";

const NotiPage = () => {
    const dispatch = useDispatch();
    const { notices = [], isLoading, error } = useSelector(
        (state) => state.NoticeReducer || {}
    );

    const [selectedNotice, setSelectedNotice] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(HandleGetMyNotices());
    }, [dispatch]);

    // Lọc thông báo
    const filteredNotices = notices.filter((item) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
            item.notice?.title?.toLowerCase().includes(lowerSearchTerm) ||
            item.notice?.content?.toLowerCase().includes(lowerSearchTerm)
        );
    });

    // Đếm số lượng thông báo
    const totalNotices = notices.length;
    const filteredCount = filteredNotices.length;

    if (isLoading && notices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50/50">
                <div className="w-10 h-10 mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <p className="font-medium text-slate-500">Đang tải thông báo...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 bg-slate-50/50 md:p-8">
            <div className="mx-auto max-w-8xl">
                
                {/* Header & Stats */}
                <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 shadow-lg rounded-2xl shadow-blue-200">
                            <Bell className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Thông báo</h1>
                            <p className="text-sm font-medium text-slate-500">
                                Bạn có <span className="text-blue-600">{totalNotices}</span> thông báo mới
                            </p>
                        </div>
                    </div>
                    <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                      dispatch(HandleGetMyNotices());
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 text-sm font-medium"
                  >
                    <RefreshCcw size={16} /> Tải lại
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm tiêu đề hoặc nội dung thông báo..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                    />
                    {searchTerm && (
                        <div className="absolute text-xs font-medium -translate-y-1/2 right-4 top-1/2 text-slate-400">
                            Tìm thấy {filteredCount} kết quả
                        </div>
                    )}
                </div>

                {/* Error State */}
                {error?.status && (
                    <div className="flex items-center gap-3 p-4 mb-6 text-red-700 border border-red-100 bg-red-50 rounded-2xl">
                        <AlertCircle size={20} />
                        <p className="text-sm font-medium">{error.message}</p>
                    </div>
                )}

                {/* List of Notices */}
                {filteredNotices.length === 0 ? (
                    <div className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-3xl">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100">
                            <Inbox size={32} className="text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-700">Không có thông báo</h3>
                        <p className="mt-1 text-sm text-slate-400">Hộp thư thông báo của bạn hiện đang trống.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredNotices.map((item) => {
                            const isSelected = selectedNotice?._id === item._id;
                            return (
                                <div
                                    key={item._id}
                                    className={`bg-white border transition-all duration-200 rounded-2xl overflow-hidden ${
                                        isSelected 
                                        ? "border-blue-400 ring-4 ring-blue-50 shadow-md" 
                                        : "border-slate-200 hover:border-blue-200 shadow-sm"
                                    }`}
                                >
                                    <div 
                                        className="flex items-center justify-between p-5 cursor-pointer"
                                        onClick={() => setSelectedNotice(isSelected ? null : item)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-blue-600" : "bg-blue-400 animate-pulse"}`}></div>
                                            <div>
                                                <h2 className={`font-bold transition-colors ${isSelected ? "text-blue-600" : "text-slate-800"}`}>
                                                    {item.notice?.title}
                                                </h2>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(item.notice?.createdAt).toLocaleDateString("vi-VN")}
                                                    </span>
                                                    <span className="flex items-center gap-1 capitalize">
                                                        <Info size={12} />
                                                        Thông báo hệ thống
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight 
                                            size={18} 
                                            className={`text-slate-300 transition-transform duration-300 ${isSelected ? "rotate-90 text-blue-500" : ""}`} 
                                        />
                                    </div>
                                    
                                    {/* Expandable Content */}
                                    <div 
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                            isSelected ? "max-h-[500px] border-t border-slate-100" : "max-h-0"
                                        }`}
                                    >
                                        <div className="p-6 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 text-slate-600">
                                            {item.notice?.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotiPage;