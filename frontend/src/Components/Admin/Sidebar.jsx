import { forwardRef } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "../../Constants/Index";
import { cn } from '../../Utils/cn';
import logo from '../../assets/logo.png';

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside ref={ref} className={cn(
            "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-200 bg-white shadow-sm transition-all duration-300 ease-in-out dark:border-slate-700 dark:bg-black",
            collapsed ? "md:w-[70px]" : "md:w-[240px]",
            collapsed ? "max-md:-left-full" : "max-md:left-0",
        )}>
            {/* Professional logo section */}
            <div className={cn(
                "flex items-center gap-x-3 p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-[#FAAD00]/8 to-[#FFC746]/8 dark:from-[#FAAD00]/12 dark:to-[#FFC746]/12",
                collapsed && "md:justify-center md:px-2"
            )}>
                
                {!collapsed && (
                   <div className="flex flex-col min-w-0">
                        <h1 className="text-lg font-bold truncate">
                            <span className="text-white">Structura</span>
                            <span className="text-[#FAAD00] dark:text-[#FFC746]">X</span>
                        </h1>
                    </div>
                )}
            </div>
                     
            {/* Navigation section */}
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-4 custom-scrollbar">
                {navbarLinks.map((navbarLink, groupIndex) => (
                    <nav key={navbarLink.title} className="sidebar-group">
                        <h3 className={cn(
                            "mb-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider", 
                            collapsed && "md:w-[45px] md:text-center md:truncate md:text-[10px]"
                        )}>
                            {collapsed ? navbarLink.title.charAt(0) : navbarLink.title}
                        </h3>
                        <div className="space-y-1">
                            {navbarLink.links.map((link, linkIndex) =>
                                <NavLink 
                                    key={link.label}
                                    to={link.path}
                                    end={link.path === "/admin"}
                                    className={({ isActive }) => cn(
                                        "group relative flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 border-2 border-transparent",
                                        // Default state
                                        "text-slate-700 dark:text-slate-300",
                                        // Hover state
                                        "hover:bg-[#FAAD00]/5 hover:text-[#FAAD00] hover:border-[#FAAD00]/30 dark:hover:bg-[#FFC746]/5 dark:hover:text-[#FFC746] dark:hover:border-[#FFC746]/30",
                                        // Collapsed state
                                        collapsed && "md:w-[45px] md:justify-center md:px-2",
                                        // Active state - border only
                                        isActive && "border-[#FAAD00] bg-[#FAAD00]/5 text-[#FAAD00] dark:border-[#FFC746] dark:bg-[#FFC746]/5 dark:text-[#FFC746]"
                                    )}
                                >
                                    {/* Active indicator bar */}
                                    <div className={cn(
                                        "absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#FAAD00] to-[#FFC746] opacity-0 transition-opacity duration-200 rounded-r-full",
                                        "group-[.active]:opacity-100"
                                    )} />
                                    
                                    {/* Icon */}
                                    <div className="relative flex-shrink-0">
                                        <link.icon size={20} className="transition-transform duration-200 group-hover:scale-105" />
                                    </div>
                                    
                                    {/* Label and badge */}
                                    {!collapsed && (
                                        <div className="flex items-center justify-between flex-1 min-w-0">
                                            <span className="whitespace-nowrap font-medium truncate">{link.label}</span>
                                            {link.badge && (
                                                <span className="ml-2 rounded-full border-2 border-[#FAAD00] bg-[#FAAD00]/10 text-[#FAAD00] dark:border-[#FFC746] dark:bg-[#FFC746]/10 dark:text-[#FFC746] px-2 py-0.5 text-xs font-semibold flex-shrink-0">
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

            {/* Professional footer section */}
            {!collapsed && (
                <div className="mt-auto border-t border-slate-200 dark:border-slate-700 p-4">
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-2">
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
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};