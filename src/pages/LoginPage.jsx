import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Lock, User } from "lucide-react";
import { Button } from "../components/ui";
import { Input, Form } from "../components/forms";
import { ROUTES } from "../constants";
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

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    criteriaMode: "all", // Hiển thị tất cả errors
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    // Tạm thời không cần xử lý API, nhập gì cũng đăng nhập được
    console.log("Login attempt:", data);

    // Lưu thông tin đăng nhập vào localStorage (tạm thời)
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("username", data.username);

    // Redirect về trang chủ
    navigate(ROUTES.HOME);
  };

  const onError = (errors) => {
    // Log errors để debug
    console.log("Validation errors:", errors);
    // Force update formState để trigger re-render
    // React Hook Form sẽ tự động update formState.errors khi validation fail
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <Form
            methods={methods}
            onSubmit={onSubmit}
            onError={onError}
            className="space-y-6"
          >
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
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Quên mật khẩu?
              </a>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Đăng nhập
            </Button>
          </Form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2025 Trung Tâm Đào Tạo Lái Xe. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}



