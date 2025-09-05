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
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice.ts";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  success: boolean;
  message: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response.data.token && response.data.user) {
        // ✅ update Redux state (user + token + isAuthenticated = true)
        dispatch(
          setUser({
            id: response.data.user.id,
            name: response.data.user.name ?? "",
            email: response.data.user.email,
            role: response.data.user.role,
            token: response.data.token,
            isAuthenticated: true,
          })
        );
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center h-screen md:pt-14 md:h-[760px]">
      <div className="flex justify-center items-center flex-1 px-4 md:px-0">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              Login into your account
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm font-serif text-center">
              Enter your details below to login your account
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
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
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
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
                  <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              {/* Link */}
              <p className="text-center text-gray-600 dark:text-gray-300">
                Don't have an account?{" "}
                <Link to="/signup">
                  <span className="underline cursor-pointer hover:text-gray-800">
                    Sign up
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

export default Login;
