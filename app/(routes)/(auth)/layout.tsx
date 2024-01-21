import Image from "next/image";
import logo from "@/public/Notex.svg";

export default function AuthLayout({children}:{children:React.ReactNode}){
    return (
        <div className="flex flex-col items-center justify-center min-h-screen  pt-8 gap-8 overflow-x-hidden">
            <Image src={logo} alt="logo" width={100} height={50}/>
            {children}
        </div>
    )
}