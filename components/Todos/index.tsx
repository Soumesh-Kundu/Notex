"use client";
import useTodosAtom, { todoState } from "@/lib/store/todos";
import TodoCard from "./todoCard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NewButton from "../Buttons/NewButton";

type TodosProps = {
  data: todoState[];
};

const varients = {
  firstRender: { opactiy: 1, y: 0 ,x:0},
  newAdd: { opacity: 1, x: 0,y:0 },
  firstRenderIntial: { opacity: 0, y: 100 },
  newAddIntial: { opacity: 0, x: -100 },
};
export default function Todos({ data }: TodosProps) {
  const [todos, setTodos] = useTodosAtom();
  const [initialRender, setInitialRender] = useState(true);
  useEffect(() => {
    if (todos.length > 0) setInitialRender(false);
    setTodos(data);
  }, [data]);
  return (
    <>
      <div className={`py-3 ${data.length ===0 && 'flex-grow'}  grid grid-cols-1 px-4 sm:grid-cols-2 lg:grid-cols-3 gap-5  w-full  max-w-screen-lg mx-auto`}>
        {data.length > 0 ?
          todos.map(({ id, title, description, isCompleted }, index) => (
            <motion.div
              layout
              key={id}
              initial={!initialRender || window.innerWidth < 768 ?'newAddIntial':'firstRenderIntial'}
              animate={{opacity:1,y:0,x:0}}
              exit={{ opacity: 0, scale: 0.6 }}
              variants={varients}
              transition={{ duration: 0.5, delay: index * 0.07,damping:13,stiffness:130,mass:0.9, type: "spring" }}
            >
              <TodoCard
                key={id}
                title={title}
                description={description as string}
                isCompleted={isCompleted}
                id={id}
              />
            </motion.div>
          )):(
            <div className="pt-10 text-center text-gray-500 text-xl sm:col-span-2 lg:col-span-3 h-full flex items-center justify-center flex-col gap-5">
              <span>Take some notes to remember!</span>
              <span><NewButton>
                Take Note !
                </NewButton></span>
            </div>
          )}
      </div>
    </>
  );
}
