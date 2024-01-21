"use client";
import { Dialog, DialogFooter, DialogOverlay , DialogClose, DialogContent,  DialogPortal,  DialogTrigger, } from "../ui/dialog";
import { Button } from "../ui/button";
import { FormEvent, FormEventHandler, useRef, useState } from "react";
import { todoState } from "@/lib/store/todos";
import { addTodo } from "@/app/_actions/todos";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
type actionFnParams= {
  todo: Omit<todoState, "isCompleted" | 'id'>,
  userId:string,
  id?: string
}
type ModalProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  TriggerStyle: string;
  id?:string,
  action:{
    type:'add'|'update',
    actionFn: (params:actionFnParams) => Promise<{message:string,status:number}> 
  }

};

export default function Modal({
  TriggerStyle,
  id,
  children,
  title,
  description,
  action
}: ModalProps) {
  const session = useSession()
  const [inputs, setInputs] = useState<Omit<todoState, "isCompleted" | 'id'>>({
    title,
    description,
  });
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((state) => ({ ...state, [e.target.name]: e.target.value }));
  }
  
  
  async function handleSubmit(e:FormEvent<HTMLFormElement>){
    e.preventDefault()
    if(inputs.title.length<1 ){
      return
    }
    let data
    setLoading(true)
    switch (action.type)
    {
      case 'add':
        data=await action.actionFn({todo:inputs,userId:session.data?.user?.id as string})
        break
      case 'update':
        data=await action.actionFn({todo:inputs,userId:session.data?.user?.id as string,id:id as string})
        break
      default:
        return
    }
    if(data.status===201 || data.status===200){
      closeRef?.current?.click()
      setLoading(false)
      setInputs({title:"",description:""})
      return
    }
    closeRef?.current?.click()
    setLoading(false)
    toast.error(`Couldn't add todo`)
    return
  }
  return (
    <Dialog>
      <DialogTrigger onClick={()=>{setInputs({title,description})}} className={TriggerStyle}>{children}</DialogTrigger>
      <DialogPortal>
        <DialogContent
          className=" bg-white border-none rounded-md p-4 text-lg md:text-base scale-x-95 md:scale-100 w-full  sm:w-1/2 lg:w-1/4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !z-[100]"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3">
            <label className="flex flex-col gap-2 font-semibold">
              Title
              <input
                type="text"
                value={inputs.title}
                onChange={handleOnChange}
                name="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 font-normal"
                placeholder="title"
              />
            </label>
            <label className="flex flex-col gap-2 font-semibold">
              Description
              <input
                type="text"
                value={inputs.description ?? ""}
                onChange={handleOnChange}
                name="description"
                className="bg-gray-50 font-normal border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 "
                placeholder="title"
              />
            </label>
            <DialogFooter className="flex !flex-row gap-2 w-full md:justify-start">
              <button 
                type="submit"
                disabled= {loading}
                className="w-1/4 px-4 py-2 grid place-items-center rounded-md bg-blue-500 !text-white hover:bg-blue-600 duration-200"
              >
                
                {loading?<l-leapfrog size="38" speed="1.4" color="white"></l-leapfrog>: title.length<1?'Add':'Edit'}
              </button>
              <DialogClose hidden ref={closeRef}></DialogClose>
              <DialogClose onClick={()=>{
                setInputs({title:"",description:""})
              }} hidden={loading} className="w-1/4 p-2 bg-slate-200 hover:bg-slate-300 duration-200 rounded-md">
                  Cancel
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
        <DialogOverlay className="bg-black  bg-opacity-30 fixed top-0 w-screen h-screen " />
      </DialogPortal>
    </Dialog>
  );
}
