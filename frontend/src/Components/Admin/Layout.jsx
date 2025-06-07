import {useRef,useState} from "react";
import { Outlet } from 'react-router-dom'
// npm install @uidotdev/usehooks
import {useMediaQuery} from "@uidotdev/usehooks"

import { Sidebar } from "./SideBar";
import { Header } from "./Header";
import {cn} from "../../Utils/cn";

const  Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width:768px)");
    const [collapsed,setCollapsed] = useState(true);

    const SidebarRef = useRef(null);

    return ( 
        <div className = 'min-h-screen bg-slate-100 transition-colors dark:bg-slate-950'>
            <div className={cn("pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 tansition-opacity",
                !collapsed && "max-md:pointer-events-auto max-md:opacity-30 max-md:z-50",
            )}/>
        <Sidebar ref={SidebarRef} collapsed={collapsed}/>
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                <Header collapsed ={collapsed} setCollapsed={setCollapsed}/>
                <div className=" h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
                    <Outlet/>
                </div>
            </div>
        </div>
     );
}
 
export default Layout;