import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { Lock, User } from "lucide-react";
import { Button } from "../components/ui";
import { Input, Form } from "../components/forms";
import { ROUTES } from "../constants";
import { useAuth } from "../providers/AuthProvider";
import logoImage from "../assets/logo/logo_sonhung.png";

const loginSchema = yup.object({
  username: yup
    .string()
    .required("Tên đăng nhập là bắt buộc")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated()) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return null;
  }

  if (isAuthenticated()) {
    return null;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await login({
        user_name: data.username,
        password: data.password,
      });
      console.log(result);

      if (!result.success) {
        console.error("Login failed:", result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-shell min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo và Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img
              src={logoImage}
              alt="Trung Tâm Đào Tạo Lái Xe"
              className="h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng nhập hệ thống
          </h1>
          <p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <Form methods={methods} onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>
                  Tên đăng nhập
                  <span className="text-red-500 ml-1 font-bold">*</span>
                </span>
              </label>
              <Input
                name="username"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                <span>
                  Mật khẩu
                  <span className="text-red-500 ml-1 font-bold">*</span>
                </span>
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              {/* <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Quên mật khẩu?
              </a> */}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Đăng nhập
            </Button>
          </Form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2026 Trung Tâm Đào Tạo Lái Xe. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
