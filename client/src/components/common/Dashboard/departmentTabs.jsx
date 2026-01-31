import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ChevronsUpDown } from "lucide-react";
import correct from "../../../assets/HR-Dashboard/correct.png";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import { HandleGetHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk";
import { Loading } from "../loading.jsx";
import { HeadingBar } from "./ListDesigns.jsx";
import { DepartmentListItems } from "./ListDesigns.jsx";
import { useToast } from "../../../hooks/use-toast.js";
import { EmployeesIDSDialogBox } from "./dialogboxes.jsx";
import { UpdateDepartmentDialog } from "../../../pages/HumanResources/Department/UpdateDepartmentDialog.jsx";
import { DeleteDepartmentDialog } from "../../../pages/HumanResources/Department/DeleteDepartmentDialog.jsx";
import { NotificationListItems } from "../../../pages/HumanResources/Department/NoticDepartment.jsx";
import settings from "../../../assets/HR-Dashboard/settings.png";

export const HRDepartmentTabs = () => {
  const { toast } = useToast();
  const HRDepartmentState = useSelector(
    (state) => state.HRDepartmentPageReducer
  );
  const dispatch = useDispatch();
  const [department, setdepartment] = useState("Tất cả phòng ban");

  const currentDeptObject = HRDepartmentState.data 
    ? HRDepartmentState.data.find((item) => item.name === department) 
    : null;
  const departments = [];

  if (HRDepartmentState.data) {
    for (let index = 0; index < HRDepartmentState.data.length; index++) {
      departments.push({
        value: HRDepartmentState.data[index].name,
        label: HRDepartmentState.data[index].name,
      });
    }
  }

  useEffect(() => {
    if (HRDepartmentState.fetchData) {
      dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }));
    }

    if (HRDepartmentState.error.status) {
      toast({
        variant: "destructive",
        title: "Rất tiếc! Đã xảy ra lỗi.",
        description: `${HRDepartmentState.error.message}`,
      });
    }

    if (HRDepartmentState.success.status) {
      toast({
        title: <p className="m-1 text-xl">Thành công!</p>,
        description: (
          <div className="flex items-center justify-center gap-2">
            <img
              src={correct}
              alt=""
              className="w-6"
            />
            <p className="font-bold">{HRDepartmentState.success.message}</p>
          </div>
        ),
      });
    }
  }, [
    HRDepartmentState.fetchData,
    HRDepartmentState.error,
    HRDepartmentState.success,
  ]);

  useEffect(() => {
    dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }));
  }, []);

  if (HRDepartmentState.isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4  rounded-lg h-[100%] ">
      <div className="flex items-center justify-between Dropdown-container">
        <div className="drop-down-select flex items-center gap-2 min-[250px]:flex-col sm:flex-row">
          <ComboDropDown
            DepartmentData={departments}
            CurrentDepartment={department}
            SetCurrentDepartment={setdepartment}
          />
        </div>
        <div className="update-delete-department">
          {department !== "Tất cả phòng ban" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-900">
                  <img
                    src={settings}
                    alt=""
                    className="w-5"
                  />
                  <span className="min-[250px]:hidden sm:flex ml-2">
                    Cài đặt
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col w-40 gap-2 p-2">

                <UpdateDepartmentDialog department={currentDeptObject} />

                <DeleteDepartmentDialog
                  department={currentDeptObject}
                  onDeleted={() => setdepartment("Tất cả phòng ban")}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
      <div
        className={`department-container rounded-lg flex flex-col gap-4 h-[100%]`}
      >
        {department === "Tất cả phòng ban" ? (
          <AllDepartments
            DepartmentData={HRDepartmentState}
            SetCurrentDepartment={setdepartment}
          />
        ) : (
          <DepartmentContent
            CurrentDepartmentData={
              HRDepartmentState.data
                ? HRDepartmentState.data.find((item) => item.name == department)
                : null
            }
          />
        )}
      </div>
    </div>
  );
};

export const ComboDropDown = ({
  DepartmentData,
  CurrentDepartment,
  SetCurrentDepartment,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="departments-container">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-4 border-2 ">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-auto"
          >
            {CurrentDepartment}
            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Command>
            <CommandInput placeholder="Tìm kiếm phòng ban..." />
            <CommandList>
              <CommandEmpty>Không tìm thấy phòng ban.</CommandEmpty>
              <CommandGroup className="sm:text-sm lg:text-lg">
                {DepartmentData.map((department) => (
                  <CommandItem
                    key={department.value}
                    value={department.value}
                    onSelect={(currentValue) => {
                      console.log("this is the current value", currentValue);
                      SetCurrentDepartment(
                        currentValue === CurrentDepartment
                          ? "Tất cả phòng ban"
                          : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        CurrentDepartment === department.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {department.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const DepartmentContent = ({ CurrentDepartmentData }) => {
  const table_headings_employees = [
    "Họ và tên",
    "Email",
    "Số điện thoại",
    "Xóa nhân viên",
  ];
  const table_headings_notice = [
    "Tiêu đề",
    "Đối tượng",
    "Người tạo",
    "Xem thông báo",
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalEmployees = CurrentDepartmentData?.employees?.length || 0;
  const totalPages = Math.ceil(totalEmployees / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = CurrentDepartmentData?.employees?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  return (
    <>
      <div className="department-heading-description flex flex-col gap-4 min-[250px]:items-center sm:items-start">
        <h1 className="font-bold min-[250px]:text-xl sm:text-xl lg:text-xl">
          {CurrentDepartmentData?.name || "Phòng ban không xác định"}
        </h1>
        <p className="font-bold min-[250px]:text-xs sm:text-sm lg:text-lg min-[250px]:text-center sm:text-start">
          {CurrentDepartmentData?.description || "Chưa có mô tả cho phòng ban này."}
        </p>
      </div>
      <Tabs defaultValue="account" className="w-full h-[100%]">
        <div className="tabs-with-button flex justify-between items-center min-[250px]:flex-col-reverse sm:flex-row">
          <TabsList className="min-[250px]:max-w-[250px] md:max-w-[300px] bg-blue-200 text-blue-500 my-3 min-[250px]:flex min-[250px]:flex-col min-[250px]:py-14 min-[350px]:flex min-[350px]:flex-row min-[350px]:py-6">
            <TabsTrigger
              value="account"
              className="px-4 py-2 font-bold m-2 min-[250px]:text-xs md:text-sm"
            >
              <span className="text-blue-500">
                {CurrentDepartmentData.employees.length} Nhân viên{" "}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="px-4 py-2 font-bold m-2 min-[250px]:text-xs md:text-sm"
            >
              <span className="text-blue-500">
                {CurrentDepartmentData.notice.length} Thông báo
              </span>
            </TabsTrigger>
          </TabsList>
          <div className="edd-employees-dialog-box">
            <EmployeesIDSDialogBox DepartmentID={CurrentDepartmentData._id} />
          </div>
        </div>
        <TabsContent
          value="account"
          className="h-auto p-2 overflow-visible border-2 border-gray-400 rounded-lg"
        >
          <HeadingBar
            table_layout={"grid-cols-4"}
            table_headings={table_headings_employees}
          />
          <DepartmentListItems
            TargetedState={{
              ...CurrentDepartmentData,
              employees: currentEmployees,
            }}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-2 mt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="font-bold"
              >
                Trước
              </Button>
              <span className="text-sm font-medium">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="font-bold"
              >
                Sau
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="password"
          className={`border-2 border-gray-400 rounded-lg min-[250px]:h-[100%] md:h-[85%] min-[1650px]:h-[90%] overflow-auto p-2`}
        >
          <HeadingBar
            table_layout={"grid-cols-4"}
            table_headings={table_headings_notice}
          />
           <NotificationListItems
            TargetedState={{
              ...CurrentDepartmentData,
              employees: currentEmployees,
            }}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-2 mt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="font-bold"
              >
                Trước
              </Button>
              <span className="text-sm font-medium">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="font-bold"
              >
                Sau
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export const AllDepartments = ({ DepartmentData, SetCurrentDepartment }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const data = DepartmentData?.data || [];
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (data.length === 0) {
    return (
      <div className="py-10 font-bold text-center text-gray-500">
        Chưa có dữ liệu phòng ban nào.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {currentItems.map((department) => (
        <div
          key={department._id || department.name}
          className="flex flex-col p-4 border-2 border-gray-400 rounded-lg department-data"
        >
          <div className="department-heading-description flex justify-between items-center min-[250px]:items-center sm:items-start gap-2">
            <h1 className="font-bold min-[250px]:text-xl sm:text-2xl lg:text-xl">
              {department.name}
            </h1>
            <Button
              className="font-bold text-white bg-blue-500 border-2 border-blue-500 hover:bg-white hover:text-blue-500 shrink-0"
              onClick={() => SetCurrentDepartment(department.name)}
            >
              Xem chi tiết
            </Button>
          </div>
          <p className="font-bold mt-2 min-[250px]:text-xs sm:text-sm lg:text-lg min-[250px]:text-center sm:text-start text-gray-600">
            {department.description}
          </p>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3 py-4 border-t border-gray-100">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-bold text-gray-500 transition-colors border-2 border-gray-500 rounded-lg hover:bg-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Trước
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              const isActive = currentPage === pageNumber;

              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all duration-200 border-2 
                                        ${
                                          isActive
                                            ? "bg-gray-500 border-gray-500 text-white shadow-md scale-105"
                                            : "border-gray-500 text-gray-500 hover:bg-gray-100"
                                        }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-bold text-gray-500 transition-colors border-2 border-gray-500 rounded-lg hover:bg-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};
