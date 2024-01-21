"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import Link from "next/link";
import { forgetPassword } from "@/app/_actions/auth";
import { toast } from "react-toastify";
import { useMessageDailogAtom } from "@/lib/store/todos";
import "react-toastify/dist/ReactToastify.min.css";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Enter is requrired" })
    .email("Email is invalid"),
});

export default function ForgetPasswordForm() {
  const [,setMessage]=useMessageDailogAtom()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("submited")
    const {message,status}=await forgetPassword({email:values.email})
    if (status === 200) {
      setMessage({message:"Email Sent Succesfully",open:true})
      form.reset()
      return
    }
    if(status===401){
      toast.warning(message)
      console.log(message)
      return
    }
    toast.error("Something went wrong! 😬")
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col   border-2 mx-4 my-auto text-lg md:text-base border-gray-500 rounded-lg w-full lg:w-1/4 px-5 py-6"
        >
          <h3 className="font-semibold text-3xl md:text-2xl text-center pb-5 border-b mb-5">
            We Got Your Cover
          </h3>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg  md:text-base">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="text-lg md:text-base"
                    placeholder="alex@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  user doesn`&apos;`t exist
                </FormMessage>
              </FormItem>
            )}
          />

          <Button
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="bg-gray-900 mt-4 text-lg md:text-base disabled:!opacity-100  text-white w-full"
          >
            {
              form.formState.isSubmitting?
              <l-leapfrog
                size="40"
                speed="1.4"

                color="white" 
              ></l-leapfrog>:
              "Verify"
            }
          </Button>

          <p className="text-center font-medium  mt-1">
            already have an account ?{" "}
            <Link href="login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
}
