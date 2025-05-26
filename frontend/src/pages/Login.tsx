 import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Changed from radix to your own component
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { ModeToggle } from "@/components/mode-toggle";
 
type LoginFormFields = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>();

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormFields> = async ({
    email,
    password,
  }) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "An unexpected error occurred.");
        return;
      }

      useAuthStore.setState({ data: data.data });
      localStorage.setItem("user", JSON.stringify(data.data));
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center absolute top-0 left-0 z-20">
      <div className="flex flex-col gap-6 w-[350px] p-6 border rounded-lg shadow-md">
        <Button
          className="flex justify-end items-center gap-4 cursor-pointer  w-fit "
          variant={"ghost"}
        >
          <ModeToggle />
        </Button>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold">Welcome to WMS+</h1>
            {/* <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <span
                className="underline underline-offset-4 cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </div> */}
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            {error && <span className="text-red-500 text-sm">{error}</span>}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
