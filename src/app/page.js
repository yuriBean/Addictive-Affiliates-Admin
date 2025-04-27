"use client"
import { useRouter } from "next/navigation";
import LoginPage from "./login/page";

export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/login');
  }
  return (

    <div className="text-white flex flex-col text-center item-center justify-center min-h-screen max-w-screen bg-primary">
      <div className="space-y-10">
    <h1 className="text-5xl">
    Welcome, Admin!

    </h1>
    <button
    className="bg-secondary text-white p-3 md:p-4 text-sm md:text-md rounded-lg font-bold "
      onClick={handleClick}>
    Click to Login

    </button>
    </div>
    </div>

   
  );
}
