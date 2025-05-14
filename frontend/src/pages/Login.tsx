import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { Label } from "@radix-ui/react-dropdown-menu";
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="flex h-screen w-full items-center justify-center   z-20 absolute top-0 left-0 ">
      <div>
        <span className="cursor-pointer w-full text-left flex gap-3 items-center  mb-10">
          <ModeToggle />
        </span>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Welcome Back</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    placeholder="Enter Email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label>Password</Label>
                  <Input
                    placeholder="Enter Password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
