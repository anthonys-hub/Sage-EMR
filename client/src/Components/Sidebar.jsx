import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { RiHealthBookFill } from "react-icons/ri";
import { GrSchedule } from "react-icons/gr";
import { GoPersonFill } from "react-icons/go";
import { CiMedicalClipboard } from "react-icons/ci";
import { IoIosStats } from "react-icons/io";
import { CiSettings } from "react-icons/ci";







export default function Sidebar() {
    return (
        <div className="flex  h-screen bg-[#f8fafc]">
            <div className="bg-white flex flex-col gap-3 mt-2 w-1/8">
                <h1 className="text-[#7AAE9E] font-bold text-3xl ml-5 mt-2 flex gap-3">
                    <RiHealthBookFill className="mt-1" />Sage EMR
                </h1>

                <div className="text-semibold text-[20px] mt-5 flex  flex-col gap-5 text-gray-600 text-center">
                    <NavLink to="/schedule" className="flex flex-row items-center gap-3 justify-center cursor-pointer hover:bg-gray-200"><GrSchedule /><p>Schedule</p></NavLink>
                    <NavLink to="/patients" className="flex flex-row items-center gap-3 justify-center cursor-pointer hover:bg-gray-200"><GoPersonFill /> <p>Patients</p></NavLink>
                    <NavLink to="/charts" className="flex flex-row items-center gap-3 justify-center cursor-pointer hover:bg-gray-200"><CiMedicalClipboard /><p>Charts</p></NavLink>
                    <NavLink to="/reports" className="flex flex-row items-center gap-3 justify-center cursor-pointer hover:bg-gray-200"><IoIosStats /><p>Reports</p></NavLink>
                    <NavLink to="/settings" className="flex flex-row items-center gap-3 justify-center cursor-pointer hover:bg-gray-200"><CiSettings /><p>Settings</p></NavLink>
                </div>





            </div >

            < div className="flex-1 overflow-auto relative" >
                <Outlet />
            </div >
        </div >

    )
}

