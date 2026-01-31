import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { HandleDeleteHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk.js";

export const DeleteDepartmentDialog = ({ department, onDeleted }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        dispatch(HandleDeleteHRDepartments({ 
            apiroute: "DELETE", 
            data: { action: "delete-department",
                departmentID: department._id
             } 
        }));
        setOpen(false);
        onDeleted(); 
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex w-full gap-2 text-sm font-bold text-white bg-red-500 hover:bg-red-900">
                    <img src="../../src/assets/HR-Dashboard/delete.png" alt="" className="w-5" />
                    Xóa
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-red-600">Xác nhận xóa phòng ban</DialogTitle>
                </DialogHeader>
                <p className="py-4">
                    Bạn có chắc chắn muốn xóa phòng ban <b>{department?.name}</b>? 
                    Hành động này không thể hoàn tác.
                </p>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                    <Button className="bg-red-600 hover:bg-red-800" onClick={handleDelete}>Xác nhận xóa</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};