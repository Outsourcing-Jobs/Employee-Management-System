import { Link } from "react-router-dom"
import { ErrorPopup } from "./error-popup"
import { useSelector } from "react-redux"
export const Reset_Password = ({ handlepasswordsubmit, handlepasswordform, passworderror, targetstate }) => { 
    return (
        <>
            {targetstate.error.status ? <ErrorPopup error={targetstate.error.message} /> : null}
            {passworderror ? <ErrorPopup error={"Mật khẩu không khớp, vui lòng thử lại"} /> : null}
            <div className="flex min-h-full flex-1 min-[200px]:flex-col md:flex-row md:items-center justify-center px-6 py-12 lg:px-8 md:gap-5">

                <div className="sm:mx-auto sm:w-full sm:max-w-sm lg:mx-10">
                    <img
                        alt="Your Company" src="../../src/assets/resetpassword.png"
                        className="w-auto h-auto mx-auto"
                    />
                    <img src="../../src/assets/welcome.png" alt="" />
                </div>
                <div className="my-5 sm:mx-auto sm:w-full sm:max-w-sm lg:mx-10">
                    <h2 className="mb-5 font-bold tracking-tight text-center text-gray-900 text-2xl/9">
                    Nhập mật khẩu mới của bạn
                    </h2>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block font-medium text-gray-900 text-sm/6">
                            Mật khẩu mới
                            </label>
                            <div className="mt-2">
                                <input
                                    id="text"
                                    name="password"
                                    type="text"
                                    required
                                    // autoComplete="email"
                                    onChange={handlepasswordform}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block font-medium text-gray-900 text-sm/6">
                                Xác nhận mật khẩu mới
                                </label>
                                {/* <div className="text-sm">
                                        <Link to={"/forgot-password"}>
                                            <a className="font-semibold text-indigo-600 hover:text-indigo-500">
                                                Forgot password?
                                            </a>
                                        </Link>
                                    </div> */}
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="repeatpassword"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    onChange={handlepasswordform}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={handlepasswordsubmit}>
                                Xác nhận thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}