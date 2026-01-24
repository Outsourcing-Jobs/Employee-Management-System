import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { Button } from "@/components/ui/button"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
export const Verify_Email_Component = ({ value, handleCodeValue, handleOTPsubmit }) => {
    return (
        <div className="verifyemail flex h-[100vh] justify-center items-center">
            <div className="verify-email flex flex-col justify-center items-center gap-5 border-4 border-blue-700 min-[250px]:border-2 rounded-lg p-4 box-border">
                <div className="heading-email min-[250px]:text-center">
                Nhập mã xác thực gồm 6 chữ số của bạn tại đây
                </div>
                <div className="otp-box-content">
                    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={value} onChange={(value) => handleCodeValue(value)}>
                        <InputOTPGroup className="flex gap-2 text-xl font-bold">
                            <InputOTPSlot index={0} className="border-2 border-blue-600" />
                            <InputOTPSlot index={1} className="border-2 border-blue-600" />
                            <InputOTPSlot index={2} className="border-2 border-blue-600" />
                            <InputOTPSlot index={3} className="border-2 border-blue-600" />
                            <InputOTPSlot index={4} className="border-2 border-blue-600" />
                            <InputOTPSlot index={5} className="border-2 border-blue-600" />
                            {/* <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} /> */}
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                <div className="submit-button">
                    <Button className="font-bold text-white bg-blue-700 border-2 border-blue-700 hover:text-blue-700 hover:bg-white" onClick={handleOTPsubmit}>Xác nhận</Button>
                </div>
            </div>
        </div>
    )
}
