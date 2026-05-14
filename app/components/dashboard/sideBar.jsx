// "use client";
// import {useState} from "react";
// import{
//     LayoutDashboard,
//     BadegeDollarsign,
//     PersonStandingIcon,
//     NotebookIcon,
//     Settings2Icon,
//     LogOutIcon,
// } from "lucide-react";
// export default function dashboard(){
//     return <div className="w-[300px]"></div>
// }


// export default function sideBar(){
//     const [activeItem, setActiveItem] = useState("Dashboard");
//     return(
//         <div className="relative w-"
//     )
// }

// function HeaderItem({icon,title,activeItem,setActiveItem}) {
//     return(
//         <div
//         className={`flex flex-row space-x-3 my-2
//             ${
//                 activeItem ==title
//                 ? "font-bold text-black text-lg"
//                 : "font-medium text-gray-400"
//             }`}

//             onClick={(event)=>{
//                 setActiveItem(title);
//             }}
        
//         >
//             <div>{icon}</div>
//             <div>{title}</div>
//         </div>
//     );
// }


"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BadgeDollarSign,
    Users,
    Wallet,
    ReceiptText,
    UserPlus,
    Repeat,
    Briefcase,
    Settings2Icon,
    LogOutIcon,
} from "lucide-react";
import { apiRequest } from "@/app/core/api";

export default function SideBar() {
    const pathname = usePathname();
    const router = useRouter();

    const mainMenu = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            title: "Register",
            href: "/register",
            icon: <UserPlus size={20} />,
        },
        {
            title: "Investor Details",
            href: "/investor-details",
            icon: <Users size={20} />,
        },
        {
            title: "Mutual Funds",
            href: "/funds",
            icon: <Wallet size={20} />,
        },
        {
            title: "Portfolio",
            href: "/portfolio",
            icon: <Briefcase size={20} />,
        },
        {
            title: "SIP",
            href: "/sip",
            icon: <Repeat size={20} />,
        },
        {
            title: "Transactions",
            href: "/transactions",
            icon: <ReceiptText size={20} />,
        },
    ];

    const logout = async () => {
        try {
            const tokenCookie = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="));
            const token = tokenCookie ? tokenCookie.split("=")[1] : "";
            await apiRequest("/investor/logout", {
                method: "POST",
                body: JSON.stringify({
                    email: "admin@gmail.com",
                    token,
                }),
            });
        } catch (error) {
            console.error(error);
        }
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "investor_id=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
        router.push("/login");
    };

    return (
        <div className="w-[280px] min-h-screen shrink-0 bg-white border-r border-gray-200 flex flex-col justify-between px-7 py-9">
            <div>
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
                        <BadgeDollarSign size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-black">KFin Wings</h1>
                </div>

                <div className="mb-12">
                    <p className="text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase mb-5">
                        Main Menu
                    </p>

                    {mainMenu.map((item, index) => (
                        <HeaderItem
                            key={index}
                            icon={item.icon}
                            title={item.title}
                            href={item.href}
                            active={pathname == item.href}
                        />
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 my-4 text-gray-400 font-medium cursor-pointer">
                    <Settings2Icon size={20} />
                    <span>Settings</span>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 my-4 text-gray-400 font-medium cursor-pointer"
                >
                    <LogOutIcon size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
}

function HeaderItem({ icon, title, href, active }) {
    return (
        <Link
            href={href}
            className={`flex flex-row items-center space-x-3 my-2 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
            ${
                active
                    ? "bg-[#f5f4ff] font-bold text-black text-lg"
                    : "font-medium text-gray-400 hover:bg-gray-50"
            }`}
        >
            <div>{icon}</div>
            <div>{title}</div>
        </Link>
    );
}
