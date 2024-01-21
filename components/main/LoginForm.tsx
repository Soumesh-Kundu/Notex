"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
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
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// 1. Define a schema.
const formSchema = z.object({
  email: z.string().min(2, { message: "Email is required" }).max(50),
  password: z.string().min(2).max(50),
});

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (signInData?.ok) {
      router.replace("/");

      return;
    }
    if (signInData?.status === 401) {
      toast.error("Invalid Credentials");
      return;
    }
    if (signInData?.status === 500) {
      toast.error("Internal Server Error");
      return;
    }
  }
  async function handleGooglSignIn(){
    const signInData = await signIn("google",{redirect:true,callbackUrl:process.env.BASE_URL})
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col   gap-1 text-lg md:text-base  border-2 mx-4 my-auto border-gray-500 w-full rounded-lg lg:w-1/4 px-5 py-6"
        >
          <h3 className="font-semibold text-3xl md:text-2xl text-center pb-5 border-b mb-2">
            Login
          </h3>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg md:text-base">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="text-lg md:text-base"
                    placeholder="alex@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-lg md:text-base">
                    Password
                  </FormLabel>
                  <Link
                    href="/forget-password"
                    className="ml-2 text-blue-500 hover:underline text-right  font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    className="text-lg md:text-base"
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="text-lg md:text-base bg-gray-900 mt-4 disabled:!opacity-100 text-white w-full"
          >
            {form.formState.isSubmitting ? (
              <l-leapfrog size="40" speed="1.4" color="white"></l-leapfrog>
            ) : (
              "Login"
            )}
          </Button>
          <div className="flex  items-center w-full gap-3">
            <span className="inline-block bg-gray-500 flex-grow  h-[2px]"></span>
            <span className="font-semibold ">or</span>
            <span className="inline-block bg-gray-500 flex-grow  h-[2px]"></span>
          </div>
          <Button
            type="button"
            onClick={handleGooglSignIn}
            className="bg-gray-900  text-white text-lg md:text-sm w-full"
          >
            Login With{" "}
            <span className="ml-2 flex items-center">
              <FcGoogle className="text-lg mr-0.5" />
              oogle
            </span>
          </Button>
          <p className="text-center font-medium  mt-1">
            don&apos;t have and account ?{" "}
            <Link href="signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
}
