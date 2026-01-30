import { useState } from "react";

export const RecruitmentApplicantsDialogBox = ({ applications }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-sm rounded-lg bg-gray-500 text-white hover:bg-gray-600"
      >
        Chi tiết
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[700px] p-5">
            <h2 className="text-xl font-bold mb-4">
              Danh sách ứng viên
            </h2>

            <div className="max-h-[400px] overflow-auto space-y-2">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div
                    key={app._id}
                    className="border rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold">
                        {app.firstname} {app.lastname}
                      </div>
                      <div className="text-sm text-gray-500">
                        {app.email}
                      </div>
                      <div className="text-sm">
                        Vị trí: {app.appliedrole}
                      </div>
                    </div>

                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {app.recruitmentstatus}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center">
                  Chưa có ứng viên
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
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
