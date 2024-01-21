"use server"

import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { todoState } from "@/lib/store/todos";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

async function isValid(id: string){
    const session=await getServerSession(authOptions)
    if (id === session?.user?.id) {
        return true
    }
    return false
}
type ParamsType={todo: Omit<todoState,'id' | 'isCompleted'>,userId: string}
export async function addTodo({todo,userId}:ParamsType) : Promise<{message:string,status:number}>{
    if (!await isValid(userId)) {
        return {message:"unauthorized",status:401}
    }
    try {
        await db.todos.create({
            data:{
                ...todo,
                userId:userId,
                isCompleted:false
            }
        })
        revalidatePath('/')
        return {message:"success",status:201}
    }
    catch (error){
        console.log(error)
        return {message:"something went wrong",status:500}
    }
}
export async function deleteTodo(id: string,userId: string) : Promise<{message:string,status:number}>{
    if (!await isValid(userId)) {
        return {message:"unauthorized",status:401}
    }
    try {
        await db.todos.delete({
            where:{
                id:id
            }
        })
        revalidatePath('/')
        return {message:"success",status:200}
    }
    catch (error){
        console.log(error)
        return {message:"something went wrong",status:500}
    }
}
export async function updateTodo({todo,userId,id}:ParamsType & {id?:string}) : Promise<{message:string,status:number}>{
    if (!await isValid(userId)) {
        return {message:"unauthorized",status:401}
    }
    try {
        await db.todos.update({
            where:{
                id:id
            },
            data:{
                ...todo
            }
        })
        revalidatePath('/')
        return {message:"success",status:200}
    }
    catch (error){
        console.log(error)
        return {message:"something went wrong",status:500}
    }
}
export async function toggleTodo(id: string,userId: string) : Promise<{message:string,status:number}>{
    if (!await isValid(userId)) {
        return {message:"unauthorized",status:401}
    }
    try {
        const todo=await db.todos.findUnique({
            where:{
                id:id
            }
        })
        await db.todos.update({
            where:{
                id:id
            },
            data:{
                isCompleted: !todo?.isCompleted
            }
        })
        revalidatePath('/')
        return {message:"success",status:200}
    }
    catch (error){
        console.log(error)
        return {message:"something went wrong",status:500}
    }
}

export  async  function getTodos(userId: string) :  Promise<{data?:todoState[],message?:string,status:number}>{
    if (!await isValid(userId)) {
        return {message:"unauthorized",status:401}
    }
    try {
        const todos=await db.todos.findMany({
            where:{
                userId:userId
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return {data:todos,status:200}
    } catch (error) {
        console.log(error)
        return {message:"something went wrong",status:500}
    }
}