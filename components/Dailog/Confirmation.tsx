"use client"
import { Dialog, DialogTrigger,DialogContent, DialogOverlay, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import useTodosAtom from "@/lib/store/todos";

type ConfimationBoxProps={
    children:React.ReactNode,
    TriggerStyle:string,
    handleOnYes:(id:string,session:any)=> Promise<{message:string,status:number}>,
    id:string
}
export default function ConfirmationBox({children,TriggerStyle,handleOnYes,id}:ConfimationBoxProps) {
  const session= useSession();
  const closeRef=useRef<HTMLButtonElement | null>(null);
  const [todos,setTodos]=useTodosAtom()
  const [loading,setLoading]=useState<boolean>(false)
  async function handleClick(){
    setLoading(true)
    const res=await handleOnYes(id,session?.data?.user?.id)
    if(res.status===200){
      closeRef.current?.click()
      setLoading(false)
      const newTodos=[...todos]
      let index=newTodos.findIndex(todo=>todo.id===id)
      if(index!==-1){
        newTodos.splice(index,1)
        setTodos([...todos])
      }
      return
    }
    closeRef.current?.click()
    setLoading(false)
    toast.error("Todo couldn't be deleted")
    return
  }
  return (
    <Dialog> 
      <DialogTrigger className={TriggerStyle}>{children}</DialogTrigger>
      <DialogContent  className="bg-white text-lg md:text-base border-none rounded-md p-4 scale-x-95 md:scale-100 w-full sm:w-1/2 lg:w-1/4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex  flex-col items-center py-8">
            <p className="font-medium">
                Are you sure to delete ?
            </p>
            <div className="flex items-center gap-4 w-full justify-center duration-200">
                <button onClick={handleClick} disabled={loading} className={`w-1/4 relative p-2  rounded-md bg-blue-500 !text-white transition-all delay-100 ${loading && 'translate-x-[58%]'} hover:bg-blue-600 duration-200 grid place-items-center`}>
                  {
                    loading? 
                      <l-leapfrog size={38} speed={1.4} color="white"></l-leapfrog>
                    :
                      "Yes"
                  }
                </button>
                <DialogClose  ref={closeRef} className={`w-1/4 p-2 bg-slate-200 transition-all hover:bg-slate-300 duration-200 rounded-md ${loading && 'scale-0'}`}>
                    No
                </DialogClose>
            </div>
      </DialogContent>
      <DialogOverlay className="bg-black  bg-opacity-30 fixed top-0 w-screen h-screen " />
    </Dialog>
  );
}
