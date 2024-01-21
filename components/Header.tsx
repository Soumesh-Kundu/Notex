import Image from "next/image";
import NewButton from "./Buttons/NewButton";
import UserDropDown from "./UserDropDown";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import logo from "@/public/Notex.svg";


export default async function Header({count}:{count:number}) {
  const sessions=await getServerSession(authOptions);
  return (
    <header className="flex justify-between items-center w-full sticky top-0 px-2 md:px-8 backdrop-blur-md !z-[50] bg-black/10 py-3 ">
      <div className="font-semibold text-xl px-5">
        <Image src={logo} alt="logo" width={100} height={50}/>
      </div>
      <div className="flex items-center gap-2 md:gap-5">
       {count>0 && <NewButton >
          New
        </NewButton>}
        <UserDropDown name={sessions?.user?.name as string} email={sessions?.user?.email as string}>
            <Avatar>
              {/* <div className="w-9 h-9 rounded-full bg-pink-500"></div> */}
              <AvatarImage src={`${sessions?.user?.image}`} className="z-50 relative"></AvatarImage>
              <AvatarFallback><Image src="https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg" alt="logo" /></AvatarFallback>
            </Avatar>
          <p className="hidden md:inline z-50 relative">{sessions?.user?.name?.split(" ")[0]}</p>
        </UserDropDown>
      </div>
    </header>
  );
}
