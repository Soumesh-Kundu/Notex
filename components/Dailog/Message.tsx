import { useMessageDailogAtom } from "@/lib/store/todos";
import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";


export default function MessageDailog() {
    const  [{open,message},setMessage]=useMessageDailogAtom()

  return (
    <>
      <Dialog open={open}>
        <DialogContent className="bg-white text-lg md:text-base border-none rounded-md p-4 scale-x-95 md:scale-100 w-full sm:w-1/2 lg:w-1/4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex  flex-col items-center py-8 gap-3">
        <CheckCircle2 strokeWidth={1.25} size={34} className="text-blue-500"/>
        <p>{message}</p>
        <Link href="/login" onClick={()=>setMessage({open:false,message:""})} className="text-white font-medium bg-blue-500 py-2 px-4 rounded-md">Go Back</Link>
        </DialogContent>
        <DialogOverlay className="bg-black  bg-opacity-30 fixed top-0 w-screen h-screen " />
      </Dialog>
    </>
  );
}
