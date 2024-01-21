"use client"
import { atom,useAtom } from "jotai";
//types
export type todoState={
    id:string
    title:string,
    description:string | null,
    isCompleted:boolean
}

//atoms
const todosAtom=atom<todoState[]>([])



//exports
export default function useTodosAtom(){
    return useAtom(todosAtom)
}

  


export type MessageDailog={
    open:boolean,
    message:string
}

const messageDailogAtom=atom<MessageDailog>({open:false,message:""})

export function useMessageDailogAtom(){
    return useAtom(messageDailogAtom)
}