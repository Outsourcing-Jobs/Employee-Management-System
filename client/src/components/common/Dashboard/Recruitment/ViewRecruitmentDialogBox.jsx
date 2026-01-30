import { useState } from "react";

export const ViewRecruitmentDialogBox = ({ recruitment }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-sm rounded-lg border border-gray-400 hover:bg-gray-100"
      >
        Xem
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[500px] p-5 space-y-4">
            <h2 className="text-xl font-bold">
              {recruitment.jobtitle}
            </h2>

            <p className="text-gray-600">
              {recruitment.description}
            </p>

            <div className="text-sm">
              <b>Phòng ban:</b>{" "}
              {recruitment.department?.name}
            </div>

            <div className="text-sm">
              <b>Ngày tạo:</b>{" "}
              {new Date(recruitment.createdAt).toLocaleDateString()}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
