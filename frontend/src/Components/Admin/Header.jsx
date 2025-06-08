import PropTypes from "prop-types";
import { Bell, ChevronsLeft, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "../../Hooks/UseTheme";
import ProfileImg from "../../assets/ProfileImage.jpg";

export const Header = ({collapsed, setCollapsed}) => {
    const {theme, setTheme} = useTheme();

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 border-b border-slate-200 transition-all duration-300 dark:bg-black dark:border-slate-700">
            <div className="flex items-center gap-x-3">
                <button 
                    className="flex items-center justify-center size-10 rounded-lg text-slate-600 hover:bg-[#FAAD00]/5 hover:text-[#FAAD00] dark:text-slate-300 dark:hover:bg-[#FFC746]/5 dark:hover:text-[#FFC746] transition-all duration-300" 
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft 
                        size={20} 
                        className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                    />
                </button>
                <div className="relative flex items-center">
                    <Search size={18} className="absolute left-3 text-slate-400 dark:text-slate-500"/>
                    <input 
                        type="text" 
                        name="search" 
                        id="search" 
                        placeholder="Search..." 
                        className="pl-10 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FAAD00] hover:border-slate-300 transition-all duration-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 dark:focus:border-[#FFC746] dark:hover:border-slate-600"
                    />
                </div>
            </div>
            <div className="flex items-center gap-x-3">
                <button 
                    className="flex items-center justify-center size-10 rounded-lg text-slate-600 hover:bg-[#FAAD00]/5 hover:text-[#FAAD00] dark:text-slate-300 dark:hover:bg-[#FFC746]/5 dark:hover:text-[#FFC746] transition-all duration-300" 
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    {/* <Sun size={20} className="dark:hidden"/>
                    <Moon size={20} className="hidden dark:block"/> */}
                </button>
                <button className="flex items-center justify-center size-10 rounded-lg text-slate-600 relative hover:bg-[#FAAD00]/5 hover:text-[#FAAD00] dark:text-slate-300 dark:hover:bg-[#FFC746]/5 dark:hover:text-[#FFC746] transition-all duration-300">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#FAAD00] rounded-full dark:bg-[#FFC746]"></span>
                </button>
                <button className="size-10 overflow-hidden rounded-full ring-2 ring-slate-200 hover:ring-[#FAAD00] dark:ring-slate-700 dark:hover:ring-[#FFC746] transition-all duration-300">
                    <img src={ProfileImg} alt="profile image" className="size-full object-cover"/>
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};