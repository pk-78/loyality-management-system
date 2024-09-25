import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginError, setLoginError] = useState(""); // Custom error for login
  const navigate = useNavigate();

  function OnSubmit(data) {
    setLoginError(""); // Clear any previous login errors
    console.log(data)

    if (data.userId === "admin" && data.password === "12345678") {
      toast.success("Login Successful");
      navigate("/patient-search");
    } else {
      setLoginError("Invalid User ID or password");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(OnSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="userId"
                    placeholder="Enter your User ID"
                    className="pl-8"
                    {...register("userId", {
                      required: "This field is required",
                    })}
                  />
                </div>
                {errors.userId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.userId?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-8"
                    {...register("password", {
                      required: "This field is required",
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password?.message}
                  </p>
                )}
              </div>
            </div>
            {/* Display custom login error */}
            {loginError && (
              <p className="text-red-500 text-sm mt-2">{loginError}</p>
            )}
            <Button type="submit" className="w-full mt-4">
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-600">
            Don't have an account? Contact your administrator.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
