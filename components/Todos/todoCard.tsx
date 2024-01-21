"use client";
import { BsTrash3 } from "react-icons/bs";
import { Checkbox } from "@/components/ui/checkbox";
import { MdEditSquare } from "react-icons/md";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Modal from "../Dailog/Modal";
import ConfirmationBox from "../Dailog/Confirmation";
import { useEffect, useState } from "react";
import { deleteTodo, toggleTodo, updateTodo } from "@/app/_actions/todos";
import { useSession } from "next-auth/react";
import useTodosAtom from "@/lib/store/todos";
import { toast } from "react-toastify";
export type CardProps = {
  title: string;
  description: string;
  isCompleted: boolean;
  id: string;
};
export default function TodoCard({
  id,
  title,
  description,
  isCompleted,
}: CardProps) {
  const session=useSession()
  const [checked, setChecked] = useState<boolean>(isCompleted);
  async function toggleComplete(){
    setChecked((prev)=>!prev)
    const data=await toggleTodo(id,session?.data?.user?.id as string)
    if(data.status===200){
      return
    }
    toast.error('Could not change todo')
    setChecked((prev)=>!prev)
  }

  return (
    <Card className="!bg-gray-200 border-none !text-black">
      <CardHeader>
        <CardTitle className="flex items-start gap-3 justify-between">
          <p className="relative">
            <span
              className={`h-[2px] ${
                checked ? "w-full" : "w-0"
              } duration-200 bg-black absolute top-1/2 `}
            ></span>
            {title}
          </p>
          <Checkbox
            checked={checked}
            onCheckedChange={() => {
              toggleComplete();
            }}
            className="w-6 h-6  !text-black !bg-white checked:!bg-red-500"
          />
        </CardTitle>
        <CardDescription className="!text-black">
          <span className={`relative w-auto ${description!==""?'visible':'invisible'}`}>
            <span
              className={`h-[2px] ${
                checked ? "w-full" : "w-0"
              } duration-200 bg-black absolute top-1/2 `}
            ></span>
            {description?description:"no description"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-start gap-7 ">
        <ConfirmationBox
          handleOnYes={deleteTodo}
          id={id}
          TriggerStyle="!bg-transparent"
        >
          <BsTrash3 className="text-xl  text-red-500" />
        </ConfirmationBox>
        <Modal
          action={{type:'update',actionFn:updateTodo}}
          TriggerStyle="!bg-transparent -ml-3"
          title={title}
          id={id}
          description={description}
        >
          <MdEditSquare className={`text-2xl  text-blue-500 ${checked?"invisible":'visible'}`} />
        </Modal>
      </CardFooter>
    </Card>
  );
}
