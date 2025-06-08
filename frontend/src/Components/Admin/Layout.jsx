import {useEffect, useRef,useState} from "react";
import { Outlet } from 'react-router-dom'
// npm install @uidotdev/usehooks
import {useMediaQuery} from "@uidotdev/usehooks"

import { Sidebar } from "./SideBar";
import { Header } from "./Header";
import {cn} from "../../Utils/cn";
import {UseClickOutside} from "../../Hooks/UseClickOutside"

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width:768px)");
    const [collapsed,setCollapsed] = useState(!isDesktopDevice);

    const SidebarRef = useRef(null);

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    UseClickOutside([SidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return ( 
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300 dark:from-slate-950 dark:to-black'>
            {/* Enhanced overlay with gradient */}
            <div className={cn(
                "pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-black/80 to-slate-900/80 opacity-0 transition-all duration-300 backdrop-blur-sm",
                !collapsed && "max-md:pointer-events-auto max-md:opacity-100 max-md:z-50",
            )}/>
            
            <Sidebar ref={SidebarRef} collapsed={collapsed}/>
            
            <div className={cn(
                "transition-all duration-300 ease-in-out", 
                collapsed ? "md:ml-[70px]" : "md:ml-[240px]"
            )}>
                <Header collapsed={collapsed} setCollapsed={setCollapsed}/>
                
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6 relative">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FAAD00] to-[#FFC746]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,173,0,0.1)_0%,transparent_50%)]"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <Outlet/>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Layout;