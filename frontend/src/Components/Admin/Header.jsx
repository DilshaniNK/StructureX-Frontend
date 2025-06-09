import PropTypes from "prop-types";
import { Bell, ChevronsLeft, Moon, Search, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Hooks/UseTheme";
import ProfileImg from "../../assets/ProfileImage.jpg";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    // Handler for profile image click
    const handleProfileClick = () => {
        navigate("/admin/profile");
    };

    // Handler for bell icon click
    const handleNotificationClick = () => {
        navigate("/admin/notifications");
    };

    return (
        <div className="flex items-center justify-between h-16 px-4 bg-black shadow-sm border-b border-gray-800">
            {/* Left Section - Collapse Button, StructuaX, and Search */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                    <ChevronsLeft 
                        size={20} 
                        className={`text-gray-300 hover:text-white transition-all duration-200 ${
                            collapsed ? 'rotate-180' : ''
                        }`} 
                    />
                </button>

                {/* Search Bar */}
                <div className="relative">
                    <Search 
                        size={18} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-80 pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 hover:bg-gray-700 transition-colors duration-200"
                    />
                </div>
            </div>

            {/* Right Section - Icons and Profile */}
            <div className="flex items-center space-x-4">
                {/* Theme Toggle Button */}
                {/* <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                    {theme === "light" ? (
                        <Moon size={20} className="text-gray-300 hover:text-white transition-colors duration-200" />
                    ) : (
                        <Sun size={20} className="text-gray-300 hover:text-white transition-colors duration-200" />
                    )}
                </button> */}

                {/* Notification Bell Button */}
                <button
                    onClick={handleNotificationClick}
                    className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
                >
                    <Bell 
                        size={20} 
                        className="text-gray-300 group-hover:text-white transition-colors duration-200" 
                    />
                    {/* Optional notification badge */}
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        3
                    </span>
                </button>

                {/* Profile Image Button */}
                <button
                    onClick={handleProfileClick}
                    className="relative group ml-2"
                >
                    <img
                        src={ProfileImg}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-600 hover:border-gray-400 transition-colors duration-200"
                    />
                    {/* Online status indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-black rounded-full"></span>
                </button>
            </div>
        </div>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};