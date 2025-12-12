import { Link } from "react-router-dom";
import { ROUTES } from "../constants";
import {
  UserPlus,
  BookOpen,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="h-[calc(100vh-65px)] bg-linear-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trung Tâm Đào Tạo Lái Xe
          </h1> 
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hệ thống quản lý đào tạo và cấp giấy phép lái xe chuyên nghiệp
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {/* Tạo khóa đào tạo Card */}
          <Link to={ROUTES.COURSES} className="group">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-300 h-full">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <BookOpen className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Tạo khóa đào tạo
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Tạo và quản lý các khóa đào tạo lái xe mới với đầy đủ thông
                    tin và lịch trình
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Bắt đầu ngay</span>
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Tạo học viên Card */}
          <Link to={ROUTES.STUDENTS} className="group">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-300 h-full">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                  <UserPlus className="w-7 h-7 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    Tạo học viên
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Đăng ký học viên mới và quản lý hồ sơ đầy đủ thông tin cá
                    nhân và giấy tờ
                  </p>
                  <div className="flex items-center text-green-600 font-medium">
                    <span>Bắt đầu ngay</span>
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
