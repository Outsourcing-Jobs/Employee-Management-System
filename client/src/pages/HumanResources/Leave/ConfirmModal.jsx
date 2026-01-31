const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  status,
  employeeName,
  isLoading,
}) => {
  if (!isOpen) return null;

  const isApprove = status === "Approved";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center mt-0 bg-black/40 backdrop-blur-sm"
      style={{ marginTop: "-10px" }}
    >
      <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl">
        <h4 className="mb-2 text-xl font-bold text-slate-800">
          Xác nhận thao tác
        </h4>
        <p className="mb-6 text-slate-600">
          Bạn có chắc chắn muốn{" "}
          <span
            className={
              isApprove ? "text-blue-600 font-bold" : "text-red-600 font-bold"
            }
          >
            {isApprove ? "PHÊ DUYỆT" : "TỪ CHỐI"}
          </span>{" "}
          đơn nghỉ phép của <b>{employeeName}</b>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-all ${
              isApprove
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-red-600 hover:bg-red-700"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
