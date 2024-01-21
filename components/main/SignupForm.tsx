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
import { register } from "@/app/_actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const formSchema = z.object({
  name: z.string().min(1,{message:"Name is required"}),
  email: z.string().min(1,{message:"Email is required"})
  .email("Email is invalid"),
  password: z.string().min(1,{message:"Password is required"})
  .min(8, {
    message: "Password must be at least 8 characters",
  }),
  confirmPassword: z.string()
  .min(1, {
    message: "Confirm Password is required",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignupForm() {
  const router=useRouter();
  // 1. Define a form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
     const {status,message}=await register(values);
     if(status===200){
      toast.success("User created successfully");
      router.replace("/login")
     }
     if (status === 400) {
      toast.info(message);
     }
     if (status === 500) {
      toast.error(message);
     }
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col   border-2 mx-4 my-auto text-lg md:text-base border-gray-500 rounded-lg w-full lg:w-1/4 px-5 py-6"
        >
          <h3 className="font-semibold text-3xl md:text-2xl text-center pb-5 border-b mb-2">
            Sign Up
          </h3>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg md:text-base">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="text-lg md:text-base" placeholder="Alex" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg md:text-base">Email</FormLabel>
                <FormControl>
                  <Input type="email" className="text-lg md:text-base" placeholder="alex@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg md:text-base">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="text-lg md:text-base" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel  className="text-lg md:text-base">Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" className="text-lg md:text-base" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit"    disabled={form.formState.isSubmitting} className="bg-gray-900 mt-4 text-lg md:text-base text-white  disabled:!opacity-100 w-full">
            {
              form.formState.isSubmitting?
              <l-leapfrog size="40" speed="1.4" color="white"></l-leapfrog>:
              "Sign Up"
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
