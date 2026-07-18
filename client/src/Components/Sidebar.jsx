import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { RiHealthBookFill } from "react-icons/ri";
import { GrSchedule } from "react-icons/gr";
import { GoPersonFill } from "react-icons/go";
import { CiMedicalClipboard } from "react-icons/ci";
import { IoIosStats } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import Header from "./Header";

export default function Sidebar() {
  const getLinkClass = ({ isActive }) => {
    const baseClasses = "flex flex-row items-center gap-3 justify-center cursor-pointer";

    return isActive
      ? `${baseClasses} bg-[#7AAE9E] text-white py-2 `
      : `${baseClasses} hover:bg-gray-200 py-2`;
  };

  return (
    <div className="flex h-screen bg-[#f8faf7]">
      <div className="bg-[white] flex border-r-2 border-[#e2e2e2] flex-col gap-3 mt-2 shrink-0 w-64">
        <h1 className="text-[#7AAE9E] font-bold text-3xl ml-5 mt-2 flex gap-3">
          <RiHealthBookFill className="mt-1" />
          Sage EMR
        </h1>

        <div className="text-semibold  font-quicksand text-[20px] mt-5 flex flex-col  text-[#7AAE9E] text-center">
          <NavLink to="/schedule" className={getLinkClass}>
            <GrSchedule />
            <p>Schedule</p>
          </NavLink>
          <NavLink to="/patients" className={getLinkClass}>
            <GoPersonFill /> <p>Patients</p>
          </NavLink>
          <NavLink to="/charts" className={getLinkClass}>
            <CiMedicalClipboard />
            <p>Charts</p>
          </NavLink>
          <NavLink to="/reports" className={getLinkClass}>
            <IoIosStats />
            <p>Reports</p>
          </NavLink>
          <NavLink to="/settings" className={getLinkClass}>
            <CiSettings />
            <p>Settings</p>
          </NavLink>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}