import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState, useEffect } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector, useDispatch } from "react-redux"
import { HandleGetHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk"
import { Loading } from "../loading.jsx"
import { HeadingBar } from "./ListDesigns.jsx"
import { DepartmentListItems } from "./ListDesigns.jsx"
import { useToast } from "../../../hooks/use-toast.js"
import { EmployeesIDSDialogBox } from "./dialogboxes.jsx"



export const HRDepartmentTabs = () => {
    const { toast } = useToast()
    const HRDepartmentState = useSelector((state) => state.HRDepartmentPageReducer)
    const dispatch = useDispatch()
    const [department, setdepartment] = useState("Tất cả phòng ban")

    const departments = []

    if (HRDepartmentState.data) {
        for (let index = 0; index < HRDepartmentState.data.length; index++) {
            departments.push({
                value: HRDepartmentState.data[index].name,
                label: HRDepartmentState.data[index].name
            })
        }
    }

    useEffect(() => {
        if (HRDepartmentState.fetchData) {
            dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }))
        }

        if (HRDepartmentState.error.status) {
            toast({
                variant: "destructive",
                title: "Rất tiếc! Đã xảy ra lỗi.",
                description: `${HRDepartmentState.error.message}`,
            })
        }

        if (HRDepartmentState.success.status) {
            toast({
                title: <p className="m-1 text-xl">Thành công!</p>,
                description: <div className="flex items-center justify-center gap-2">
                    <img src="../../src/assets/HR-Dashboard/correct.png" alt="" className="w-6" />
                    <p className="font-bold">{HRDepartmentState.success.message}</p>
                </div>,
            })
        }

        console.log("test message")

    }, [HRDepartmentState.fetchData, HRDepartmentState.error, HRDepartmentState.success])


    useEffect(() => {
        dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }))
    }, [])


    if (HRDepartmentState.isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="flex flex-col gap-4 bg-blue-50 min-[250px]:p-1 sm:p-4 rounded-lg h-[100%] overflow-auto">
            <div className="flex items-center justify-between Dropdown-container">
                <div className="drop-down-select flex items-center gap-2 min-[250px]:flex-col sm:flex-row">
                    <h1 className="font-bold sm:text-sm lg:text-lg min-[250px]:hidden sm:flex">Department : </h1>
                    <ComboDropDown DepartmentData={departments} CurrentDepartment={department} SetCurrentDepartment={setdepartment} />
                </div>
                <div className="update-delete-department">
                    {department !== "Tất cả phòng ban" ?
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button className="bg-blue-700 hover:bg-blue-900">
                                    <img src="../../src/assets/HR-Dashboard/settings.png" alt="" className="w-5" />
                                    <span className="min-[250px]:hidden sm:flex">Cài đặt</span></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="flex flex-col items-center justify-center p-2">
                                {/* <DropdownMenuLabel>Update or Delete The Department</DropdownMenuLabel> */}
                                <div className="flex flex-col gap-2 buttons">
                                    <Button className="text-sm font-bold text-white bg-blue-700 hover:bg-blue-900">
                                        <img src="../../src/assets/HR-Dashboard/update.png" alt="" className="w-5" />
                                        Cập nhật 
                                    </Button>
                                    <Button className="text-sm font-bold text-white bg-red-700 hover:bg-red-900">
                                        <img src="../../src/assets/HR-Dashboard/delete.png" alt="" className="w-5" />
                                       Xóa
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu> : null}
                </div>
            </div>
            <div className={`department-container min-[250px]:px-1 sm:px-4 rounded-lg flex flex-col gap-4 h-[100%]`}>
                {
                    department === "Tất cả phòng ban" ? <AllDepartments DepartmentData={HRDepartmentState} SetCurrentDepartment={setdepartment} /> :
                        <DepartmentContent CurrentDepartmentData={HRDepartmentState.data ? HRDepartmentState.data.find((item) => item.name == department) : null} />
                }
            </div>
        </div>

    )
}


export const ComboDropDown = ({ DepartmentData, CurrentDepartment, SetCurrentDepartment }) => {

    const [open, setOpen] = useState(false)

    return (
        <div className="departments-container">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className="w-4 border-2 border-blue-500">
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
                                            console.log("this is the current value", currentValue)
                                            SetCurrentDepartment(currentValue === CurrentDepartment ? "Tất cả phòng ban" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                CurrentDepartment === department.value ? "opacity-100" : "opacity-0"
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
    )
}


export const DepartmentContent = ({ CurrentDepartmentData }) => {
    const table_headings_employees = ["Họ và tên", "Email", "Số điện thoại", "Xóa nhân viên"];
    const table_headings_notice = ["Tiêu đề", "Đối tượng", "Người tạo", "Xem thông báo"];

    return (
        <>
            <div className="department-heading-description flex flex-col gap-4 min-[250px]:items-center sm:items-start">
                <h1 className="font-bold min-[250px]:text-xl sm:text-2xl lg:text-4xl">{CurrentDepartmentData.name}</h1>
                <p className="font-bold min-[250px]:text-xs sm:text-sm lg:text-lg min-[250px]:text-center sm:text-start">
                    {CurrentDepartmentData.description}
                </p>
            </div>
            <Tabs defaultValue="account" className="w-full h-[100%]">
                <div className="tabs-with-button flex justify-between items-center min-[250px]:flex-col-reverse sm:flex-row">
                    <TabsList className="min-[250px]:max-w-[250px] md:max-w-[300px] bg-blue-200 text-blue-700 my-3 min-[250px]:flex min-[250px]:flex-col min-[250px]:py-14 min-[350px]:flex min-[350px]:flex-row min-[350px]:py-6">
                        <TabsTrigger value="account" className="px-4 py-2 font-bold m-2 min-[250px]:text-xs md:text-sm">
                            <span className="text-blue-700">{CurrentDepartmentData.employees.length} Nhân viên </span>
                        </TabsTrigger>
                        <TabsTrigger value="password" className="px-4 py-2 font-bold m-2 min-[250px]:text-xs md:text-sm">
                            <span className="text-blue-700">{CurrentDepartmentData.notice.length} Thông báo</span>
                        </TabsTrigger>
                    </TabsList>
                    <div className="edd-employees-dialog-box">
                        <EmployeesIDSDialogBox DepartmentID={CurrentDepartmentData._id} />
                    </div>
                </div>
                <TabsContent value="account" className={`border-2 border-blue-500 rounded-lg min-[250px]:h-[100%] md:h-[85%] min-[1650px]:h-[90%] overflow-auto p-2`}>
                    <HeadingBar table_layout={"grid-cols-4"} table_headings={table_headings_employees} />
                    <DepartmentListItems TargetedState={CurrentDepartmentData} />
                </TabsContent>
                <TabsContent value="password" className={`border-2 border-blue-500 rounded-lg min-[250px]:h-[100%] md:h-[85%] min-[1650px]:h-[90%] overflow-auto p-2`}>
                    <HeadingBar table_layout={"grid-cols-4"} table_headings={table_headings_notice} />
                </TabsContent>
            </Tabs>
        </>
    )
}


export const AllDepartments = ({ DepartmentData, SetCurrentDepartment }) => {
    return (
        <>
            {DepartmentData.data ? DepartmentData.data.map((department) => <div key={department.name} className="flex flex-col gap-4 p-4 border-2 border-blue-700 rounded-lg department-data">
                <div className="department-heading-description flex justify-between items-center min-[250px]:items-center sm:items-start">
                    <h1 className="font-bold min-[250px]:text-xl sm:text-2xl lg:text-4xl">{department.name}</h1>
                    <Button className="font-bold text-white bg-blue-700 border-2 border-blue-700 hover:bg-white hover:text-blue-700" onClick={() => SetCurrentDepartment(department.name)}>Xem chi tiết</Button>
                </div>
                <p className="font-bold min-[250px]:text-xs  sm:text-sm lg:text-lg min-[250px]:text-center sm:text-start">
                    {department.description}
                </p>
            </div>) : null}
        </>
    )
}