import { getServerSession } from "next-auth";
import Header from "../../components/Header";
import Todos from "../../components/Todos";
import { todoState } from "@/lib/store/todos";
import { permanentRedirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getTodos } from "../_actions/todos";


async function fetchTodos(): Promise<todoState[]> {
  const res = await fetch(`${process.env.BASE_URL}/todos/all`, {
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error("problem occured");
  }
  const data = await res.json();
  return data;
}

export default async function Home() {
  const session=await getServerSession(authOptions)
  if(session===null){
    console.log(session)
    permanentRedirect('/login')
  }
  const data = await getTodos(session?.user.id);
  return (
    <main className="flex min-h-screen  flex-col w-full items-center">
        <Header count={data?.data?.length as number}/>
        <Todos data={data.data as todoState[]} />
    </main>
  );
}
