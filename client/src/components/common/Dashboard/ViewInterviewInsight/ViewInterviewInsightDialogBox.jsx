import { useState } from "react";
import dayjs from "dayjs";

export const ViewInterviewInsightDialogBox = ({ insight }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-sm rounded-lg border"
      >
        Xem
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[600px] p-5 space-y-4">
            <h2 className="text-xl font-bold">
              Nhận xét phỏng vấn
            </h2>

            <div>
              <b>Ứng viên:</b>{" "}
              {insight.applicant.firstname}{" "}
              {insight.applicant.lastname}
            </div>

            <div>
              <b>Người phỏng vấn:</b>{" "}
              {insight.interviewer.firstname}{" "}
              {insight.interviewer.lastname}
            </div>

            <div>
              <b>Ngày phỏng vấn:</b>{" "}
              {dayjs(insight.interviewdate).format(
                "DD/MM/YYYY HH:mm"
              )}
            </div>

            <div>
              <b>Đánh giá:</b>
              <p className="mt-1 text-gray-600">
                {insight.feedback}
              </p>
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
