"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RxExit } from "react-icons/rx";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useState } from "react";
import { signOut } from "next-auth/react";

type UserDropDownsProps = {
  children: React.ReactNode,
  email:string,
  name:string
};

export default function UserDropDown({ children,email,name }: UserDropDownsProps) {
    const [isOpen,setOpen]=useState<boolean>(false)
  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger className="flex z-50 relative items-center gap-1 md:gap-3 focus:outline-none">
        {children} 
        <MdOutlineArrowForwardIos className={` text-gray-600 ${isOpen?'-rotate-90':'rotate-90'} duration-300`}/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[200] w-52 translate-y-2">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-medium flex flex-col md:hidden bg-slate-100 items-start cursor-pointer">User: {name}</DropdownMenuItem>
        <DropdownMenuItem className="font-medium flex flex-col bg-slate-100 items-start cursor-pointer">Email: {email}</DropdownMenuItem>
        <button className="w-full" onClick={()=>signOut({
          redirect:true,
          callbackUrl:`${window.location.origin}/login`
        })}>
        <DropdownMenuItem className="flex item-center  gap-3 font-medium cursor-pointer hover:!bg-slate-200 mt-1"><RxExit className="text-lg"/> Log Out </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
