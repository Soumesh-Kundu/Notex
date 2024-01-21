"use client";

import Modal from "../Dailog/Modal";
import { addTodo } from "@/app/_actions/todos";

export default function NewButton(
  {
    children
  }: {
    children: React.ReactNode;
  }
) {
  return (
    <div className="z-50">
      <Modal
        action={{ type: "add", actionFn: addTodo }}
        title=""
        description=""
        TriggerStyle="bg-blue-500 text-white relative px-4 z-[50] text-sm py-2.5 rounded-md"
      >
        {children}
      </Modal>
    </div>
  );
}
