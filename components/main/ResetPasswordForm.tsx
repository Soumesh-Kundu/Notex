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
import { resetPassword } from "@/app/_actions/auth";
import { useMessageDailogAtom } from "@/lib/store/todos";
import { toast } from "react-toastify";
const formSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm({
  id,
  token,
}: {
  id: string;
  token: string;
}) {
  const [, setMessage] = useMessageDailogAtom();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { status } = await resetPassword({
      id,
      token,
      password: values.password,
    });
    if (status === 200) {
      console.log({resetPassword:status})
      setMessage({
        open: true,
        message: "Password reset successfully",
      });
      form.reset()
      return
    }
    console.log({resetPassword:status})
    toast.error("Something went wrong");
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col    border-2 mx-4 my-auto text-lg md:text-base border-gray-500 rounded-lg w-full lg:w-1/4 px-5 py-6"
        >
          <h3 className="font-semibold text-3xl md:text-2xl text-center pb-5 border-b mb-5">
            Reset Password
          </h3>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg  md:text-base">
                  Password
                </FormLabel>
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg  md:text-base">
                  Confirm Password
                </FormLabel>
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
            className="bg-gray-900 mt-4 text-lg disabled:!opacity-100 md:text-base text-white w-full"
          >
            {form.formState.isSubmitting ? (
              <l-leapfrog size="40" speed="1.4" color="white"></l-leapfrog>
            ) : (
              "Reset"
            )}
          </Button>
        </form>
      </Form>

    </>
  );
}
