import { useSelector } from "react-redux";

export const NotificationListItems = ({ TargetedState }) => {


  return (
    <>
      {TargetedState?.notice?.map((item) => {
        const creator = TargetedState?.employees.find(emp => emp._id === item.createdby);
        const creatorName = creator ? `${creator.firstname} ${creator.lastname}` : "Người dùng hệ thống";

        return (
          <div
            key={item._id}
            className="list-item-container grid min-[250px]:grid-cols-2 sm:grid-cols-4 py-1 gap-2 justify-center items-center border-b-2 border-gray-400 last:border-b-0"
          >
            <div className="heading-content font-bold min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-md p-2 rounded-lg text-center overflow-hidden text-ellipsis">
              {item.title}
            </div>
            <div className="heading-content font-bold min-[250px]:text-sm sm:text-xs xl:text-md p-2 rounded-lg text-center overflow-hidden text-ellipsis min-[250px]:hidden sm:block">
              {item.audience}
            </div>

            <div className="heading-content font-bold min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-md p-2 rounded-lg text-center overflow-hidden text-ellipsis min-[250px]:hidden sm:block">
              {creatorName} 
            </div>

            <div className="heading-content text-gray-400 font-bold min-[250px]:text-xs xl:text-md p-2 rounded-lg text-center flex justify-center items-center min-[250px]:gap-1 xl:gap-2">
               <img
                  src="../../../../assets/notification.png"
                  alt="notification-icon"
                  className="w-6 h-6 transition-transform duration-200 cursor-pointer hover:scale-110"
                />
            </div>
          </div>
        );
      })}
    </>
  );
};