import { useToast } from "../../../hooks/use-toast.js"
import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import { HandlePostHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js"

export const FormSubmitToast = ({ formdata }) => {
    const { toast } = useToast()
    const dispatch = useDispatch()
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)


    const SubmitFormData = async () => {
        dispatch(HandlePostHREmployees({ apiroute: "ADDEMPLOYEE", data: formdata })) 
    }

    // const DisplayToast = () => {
    //     if (HREmployeesState.error.status) {
    //         return toast({
    //             variant: "destructive",
    //             title: "Uh oh! Something went wrong.",
    //             description: `${HREmployeesState.error.message}`,
    //             // action: <ToastAction altText="Try again">Try again</ToastAction>,
    //         })
    //     } else if (HREmployeesState.fetchData) {
    //         return toast({
    //             title: <p className="m-1 text-xl">Success!</p>,
    //             description: <div className="flex items-center justify-center gap-2">
    //                 <img src={correct} alt="" className="w-8" />
    //                 <p className="font-bold">Employee added successfully.</p>
    //             </div>,
    //         })
    //     }
    // }

    console.log(HREmployeesState, "This is the HR plus Employees State")
    return (
        <>
            <Button
                variant="outline"
                onClick={() => {
                    SubmitFormData()
                    // HREmployeesState.error.status ? toast({
                    //     variant: "destructive",
                    //     title: "Uh oh! Something went wrong.",
                    //     description: `${HREmployeesState.error.message}`,
                    //     // action: <ToastAction altText="Try again">Try again</ToastAction>,
                    // }) : null
                    // HREmployeesState.fetchData ? toast({
                    //     title: <p className="m-1 text-xl">Success!</p>,
                    //     description: <div className="flex items-center justify-center gap-2">
                    //         <img src={correct} alt="" className="w-8" />
                    //         <p className="font-bold">Employee added successfully.</p>
                    //     </div>,
                    // }) : null
                }}
                className="px-4 py-2 font-bold text-white bg-blue-500 border-2 border-blue-500 rounded-lg hover:bg-white hover:text-blue-500"
            >
                Thêm nhân viên
            </Button>
        </>
    )
}