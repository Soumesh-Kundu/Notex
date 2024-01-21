import { verifyUser } from "@/app/_actions/auth";
import ResetPasswordForm from "@/components/main/ResetPasswordForm";
import { permanentRedirect } from "next/navigation";

type ResetPasswordProps = {
  params: {
    params:string[]
  };
};
export default async function ResetPassword({params:{params}}: ResetPasswordProps) {
  if(params.length!==2){
    permanentRedirect("/login");
  }
  const {verified}=await verifyUser({id:params[0],token:params[1]})
  if(!verified){
    permanentRedirect("/login");
  }
  return (
    <div className="grid place-items-center w-screen  px-4">
      <ResetPasswordForm id={params[0]} token={params[1]} />
    </div>
  );
}
