import { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { navbarLinks } from "../../Constants/Index";
import { cn } from '../../Utils/cn';
import { LogOut, X } from 'lucide-react';

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowLogoutModal(false);
        navigate('/');
    };

    return (
        <>
            <aside ref={ref} className={cn(
                "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-200 bg-white shadow-lg transition-all duration-300 ease-in-out dark:border-slate-700 dark:bg-black",
                collapsed ? "md:w-[70px]" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}>
                {/* Enhanced logo section */}
                <div className={cn(
                    "flex items-center gap-x-3 p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-[#FAAD00]/10 to-[#FFC746]/10 dark:from-[#FAAD00]/15 dark:to-[#FFC746]/15",
                    collapsed && "md:justify-center md:px-2"
                )}>
                    {/* Logo icon */}
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FAAD00] to-[#FFC746] rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    
                    {!collapsed && (
                        <div className="flex flex-col min-w-0">
                            <h1 className="text-xl font-bold truncate">
                                <span className="text-slate-800 dark:text-white">Structura</span>
                                <span className="text-[#FAAD00] dark:text-[#FFC746] text-2xl">X</span>
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admin Panel</p>
                        </div>
                    )}
                </div>
                         
                {/* Enhanced navigation section */}
                <div className="flex w-full flex-col gap-y-5 overflow-y-auto overflow-x-hidden p-4 custom-scrollbar">
                    {navbarLinks.map((navbarLink, groupIndex) => (
                        <nav key={navbarLink.title} className="sidebar-group">
                            <h3 className={cn(
                                "mb-3 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider", 
                                collapsed && "md:w-[45px] md:text-center md:truncate md:text-[10px]"
                            )}>
                                {!collapsed && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#FAAD00]"></div>
                                        <span>{navbarLink.title}</span>
                                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                                    </div>
                                )}
                                {collapsed && navbarLink.title.charAt(0)}
                            </h3>
                            <div className="space-y-1">
                                {navbarLink.links.map((link, linkIndex) =>
                                    <NavLink 
                                        key={link.label}
                                        to={link.path}
                                        end={link.path === "/admin"}
                                        className={({ isActive }) => cn(
                                            "group relative flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200",
                                            // Default state
                                            "text-slate-700 dark:text-slate-300",
                                            // Hover state
                                            "hover:bg-[#FAAD00]/10 hover:text-[#FAAD00] hover:shadow-sm dark:hover:bg-[#FFC746]/10 dark:hover:text-[#FFC746]",
                                            // Collapsed state
                                            collapsed && "md:w-[45px] md:justify-center md:px-2",
                                            // Active state
                                            isActive && "bg-[#FAAD00]/15 text-[#FAAD00] shadow-md border-l-4 border-[#FAAD00] dark:bg-[#FFC746]/15 dark:text-[#FFC746] dark:border-[#FFC746]"
                                        )}
                                    >
                                        {/* Icon */}
                                        <div className="relative flex-shrink-0">
                                            <link.icon size={20} className="transition-transform duration-200 group-hover:scale-105" />
                                        </div>
                                        
                                        {/* Label and badge */}
                                        {!collapsed && (
                                            <div className="flex items-center justify-between flex-1 min-w-0">
                                                <span className="whitespace-nowrap font-semibold truncate">{link.label}</span>
                                                {link.badge && (
                                                    <span className="ml-2 rounded-full bg-[#FAAD00] text-white dark:bg-[#FFC746] px-2 py-0.5 text-xs font-bold flex-shrink-0">
                                                        {link.badge}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Tooltip for collapsed state */}
                                        {collapsed && (
                                            <div className="absolute left-full ml-2 z-50 hidden rounded-md bg-slate-900 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-white shadow-lg group-hover:md:block">
                                                {link.label}
                                                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                                            </div>
                                        )}
                                    </NavLink>
                                )}
                            </div>
                        </nav>
                    ))}
                </div>

                {/* Logout section */}
                <div className="mt-auto border-t border-slate-200 dark:border-slate-700 p-4">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className={cn(
                            "w-full flex items-center gap-x-3 rounded-lg p-3 text-sm font-semibold transition-all duration-200",
                            "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300",
                            "hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-sm",
                            collapsed && "md:justify-center md:px-2"
                        )}
                    >
                        <div className="relative flex-shrink-0">
                            <LogOut size={20} />
                        </div>
                        {!collapsed && (
                            <span className="whitespace-nowrap font-semibold">Logout</span>
                        )}
                        
                        {/* Tooltip for collapsed logout */}
                        {collapsed && (
                            <div className="absolute left-full ml-2 z-50 hidden rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white shadow-lg group-hover:md:block">
                                Logout
                                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-red-600"></div>
                            </div>
                        )}
                    </button>
                </div>

                {/* Enhanced footer section */}
                {!collapsed && (
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-start gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-[#FAAD00] dark:bg-[#FFC746] mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Need Help?</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Contact support team</p>
                                </div>
                            </div>
                            <button className="mt-3 w-full rounded-md border-2 border-[#FAAD00] bg-[#FAAD00]/10 text-[#FAAD00] dark:border-[#FFC746] dark:bg-[#FFC746]/10 dark:text-[#FFC746] px-3 py-2 text-xs font-semibold transition-all duration-200 hover:bg-[#FAAD00]/20 hover:border-[#FAAD00] dark:hover:bg-[#FFC746]/20 dark:hover:border-[#FFC746] focus:outline-none focus:ring-2 focus:ring-[#FAAD00]/50 dark:focus:ring-[#FFC746]/50">
                                Get Support
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-md mx-4">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut size={28} className="text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Confirm Logout</h3>
                            <p className="text-slate-600 dark:text-slate-300">Are you sure you want to logout from your admin account?</p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};