import { EmployeeDetailsDialogBox } from "./dialogboxes.jsx";
import { DeleteEmployeeDialogBox } from "./dialogboxes.jsx";
import { RemoveEmployeeFromDepartmentDialogBox } from "./dialogboxes.jsx";

export const ListWrapper = ({ children }) => {
  return (
    <div
      className={`wrapper-container p-2 border-2 border-gray-400 rounded-lg w-auto`}
    >
      {children}
    </div>
  );
};

export const HeadingBar = ({ table_layout, table_headings }) => {
  return (
    <div
      className={`heading-container grid min-[250px]:grid-cols-2 sm:${
        table_layout ? table_layout : `grid-cols-5`
      } rounded-lg gap-4 overflow-auto`}
    >
      {table_headings.map((item) => (
        <div
          key={item}
          className={`heading-content text-black bg-gray-200 font-bold min-[250px]:text-xs xl:text-[16px] min-[250px]:p-1 sm:p-2 rounded-lg text-center flex justify-center items-center 
                    ${
                      ["Email", "Phòng ban", "Số điện thoại"].includes(item)
                        ? `min-[250px]:hidden sm:flex`
                        : ""
                    }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export const ListContainer = ({ children }) => {
  return (
    <div
      className={`list-item-container px-2 py-2 border-2 border-gray-400 rounded-lg w-auto`}
    >
      {children}
    </div>
  );
};

export const ListItems = ({ TargetedState }) => {
  return (
    <>
      {TargetedState.data
        ? TargetedState.data.map((item) => (
            <div
              className={`list-item-container grid min-[250px]:grid-cols-2 sm:grid-cols-5 py-1 gap-2 justify-center items-center border-b-2 border-gray-400 last:border-b-0`}
            >
              <div className="heading-content font-bold min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-md p-1 rounded-lg text-start overflow-hidden text-ellipsis">
                {`${item.firstname} ${item.lastname}`}
              </div>
              <div className="heading-content font-bold min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-md p-1 rounded-lg text-start overflow-hidden text-ellipsis">
                {item.email}
              </div>
              <div className="heading-content font-bold min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-md p-1 rounded-lg text-start overflow-hidden text-ellipsis  flex justify-center items-center">
                {item.department ? item.department.name : "Chưa xác định"}
              </div>
              <div className="heading-content font-bold min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-md p-1 rounded-lg text-start overflow-hidden text-ellipsis flex justify-center items-center">
                {item.contactnumber}
              </div>
              <div className="heading-content font-bold min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-md p-1 rounded-lg text-start overflow-hidden text-ellipsis flex justify-center items-center gap-2">
                {/* <button className="px-2 py-1 border-2 border-gray-400 rounded-md btn-sm btn-gray-400 text-md hover:bg-gray-400 hover:text-white">View</button> */}
                <EmployeeDetailsDialogBox EmployeeID={item._id} />
                <DeleteEmployeeDialogBox EmployeeID={item._id} />
              </div>
            </div>
          ))
        : null}
    </>
  );
};

export const DepartmentListItems = ({ TargetedState }) => {
  console.log("this is targeted state", TargetedState);
  return (
    <>
      {TargetedState
        ? TargetedState.employees.map((item) => (
            <div
              className={`list-item-container grid min-[250px]:grid-cols-2 sm:grid-cols-4 py-1 gap-2 justify-center items-center border-b-2 border-gray-400 last:border-b-0 `}
            >
              <div className="heading-content font-bold min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-md p-2 rounded-lg text-center overflow-hidden text-ellipsis">
                {`${item.firstname} ${item.lastname}`}
              </div>
              <div className="heading-content font-bold min-[250px]:text-sm sm:text-xs xl:text-md p-2 rounded-lg text-center overflow-hidden text-ellipsis min-[250px]:hidden sm:block">
                {item.email}
              </div>
              <div className="heading-content font-bold min-[250px]:text-sm sm:text-xs lg:text-sm  xl:text-md p-2 rounded-lg text-center overflow-hidden text-ellipsis min-[250px]:hidden sm:block">
                {item.contactnumber}
              </div>
              <div className="heading-content text-gray-400 font-bold min-[250px]:text-xs xl:text-md p-2 rounded-lg text-center flex justify-center items-center min-[250px]:gap-1 xl:gap-2">
                <RemoveEmployeeFromDepartmentDialogBox
                  DepartmentName={TargetedState.name}
                  DepartmentID={TargetedState._id}
                  EmployeeID={item._id}
                />
              </div>
            </div>
          ))
        : null}
    </>
  );
};
