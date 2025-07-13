import { LuMessageCircleMore } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

const NavBar = ({ profile = true }) => {
  return (
    <div className="flex flex-row justify-end items-center p-6 bg-black h-20 w-full shadow-white">
      <div className="flex flex-row gap-4">
        <LuMessageCircleMore className="text-white w-10 h-10" />
        {profile ? (
          <img src="/Image.png" alt="" className="w-10 h-10 rounded-full" />
        ) : (
          <CgProfile className="text-white w-10 h-10" />
        )}
      </div>
    </div>
  );
};

export default NavBar;
