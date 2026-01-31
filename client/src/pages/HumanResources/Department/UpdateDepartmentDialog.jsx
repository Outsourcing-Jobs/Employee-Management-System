import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { HandlePatchHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk.js";

export const UpdateDepartmentDialog = ({ department }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        if (department && open) {
            setFormData({
                name: department.name || "",
                description: department.description || ""
            });
        }
    }, [department, open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const payload = {
            departmentID: department._id,
            UpdatedDepartment: {
                name: formData.name,
                description: formData.description
            }
        };

        dispatch(HandlePatchHRDepartments({ 
            apiroute: "UPDATE", 
            data: payload 
        }));
        
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex w-full gap-2 text-sm font-bold text-white bg-blue-500 hover:bg-blue-900">
                    <img src="../../src/assets/HR-Dashboard/update.png" alt="" className="w-5" />
                    Cập nhật
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cập nhật phòng ban</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Tên phòng ban</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Mô tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="h-24 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <Button 
                    onClick={handleSubmit} 
                    className="font-bold text-white bg-blue-600 hover:bg-blue-800"
                    disabled={!formData.name} 
                >
                    Lưu thay đổi
                </Button>
            </DialogContent>
        </Dialog>
    );
};