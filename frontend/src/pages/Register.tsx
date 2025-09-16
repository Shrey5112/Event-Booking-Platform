import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      const response = await axios.post<RegisterResponse>(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        data,
        { withCredentials: true }
      );

      toast.success(response.data.message);
      // ✅ success case
      navigate("/login");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      if (
        err.response?.status === 400 &&
        err.response?.data?.message === "User already exists"
      ) {
        // ✅ specific toast for existing user
        toast.error("User already exists. Please login instead.");
      } else {
        // generic error
        toast.error(err.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="flex items-center h-screen md:pt-14 md:h-[760px]">
      <div className="flex justify-center items-center flex-1 px-4 md:px-0">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              Create your account
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm font-serif text-center">
              Fill in the details to register a new account
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label className="py-2">Full Name</Label>
                <Input
                  type="text"
                  placeholder="Your name"
                  {...register("name", { required: "Name is required" })}
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="py-2">Email</Label>
                <Input
                  // type="email"
                  placeholder="Email Address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Label className="py-2">Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Label className="py-2">Confirm Password</Label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter Your Password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>

              <p className="text-center text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="underline cursor-pointer hover:text-gray-800">
                    Login
                  </span>
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
