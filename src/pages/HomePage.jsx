import { Link } from "react-router-dom";
import { ROUTES } from "../constants";
import {
  BookOpen,
  UserPlus,
  Calendar,
  CreditCard,
  History,
  BookText,
  Scale,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  const actionCards = [
    // {
    //   to: ROUTES.COURSES,
    //   title: "Tạo khóa đào tạo",
    //   description:
    //     "Tạo và quản lý các khóa đào tạo lái xe mới với đầy đủ thông tin và lịch trình",
    //   icon: BookOpen,
    // },
    {
      to: ROUTES.STUDENTS,
      title: "Tạo học viên",
      description:
        "Đăng ký học viên mới và quản lý hồ sơ đầy đủ thông tin cá nhân và giấy tờ",
      icon: UserPlus,
    },
    {
      to: ROUTES.SCHEDULE,
      title: "Tạo lịch học",
      description:
        "Quản lý và tạo lịch học cho các khóa đào tạo với đầy đủ thông tin giai đoạn và tuần học",
      icon: Calendar,
    },
    {
      to: ROUTES.TUITION_PROFILES,
      title: "Hồ sơ học phí",
      description:
        "Tra cứu tình trạng nộp học phí và xem lịch sử thanh toán theo từng học viên",
      icon: CreditCard,
    },
    {
      to: ROUTES.LICH_SU_NOP_HOC_PHI,
      title: "Lịch sử nộp học phí",
      description:
        "Tra cứu lịch sử nộp học phí theo mã đăng ký, thời gian nộp và thông tin học viên",
      icon: History,
    },
    {
      to: ROUTES.NHAT_KY_CHUNG_TU,
      title: "Nhật ký chứng từ",
      description:
        "Tổng hợp và theo dõi chứng từ kế toán theo thời gian, tài khoản nợ và tài khoản có",
      icon: BookText,
    },
    {
      to: ROUTES.BANG_CAN_DOI_TAI_KHOAN,
      title: "Bảng cân đối tài khoản",
      description:
        "Xem tổng phát sinh Nợ/Có và chênh lệch theo tài khoản cha trong kỳ",
      icon: Scale,
    },
    {
      to: ROUTES.THONG_KE_HOC_PHI,
      title: "Thống kê học phí",
      description:
        "Tổng hợp số dư đầu kỳ, phát sinh trong kỳ và số dư cuối kỳ theo từng tháng",
      icon: BarChart3,
    },
  ];

  return (
    <div className="home-page-shell bg-linear-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trung Tâm Đào Tạo Lái Xe
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Hệ thống quản lý đào tạo và cấp giấy phép lái xe chuyên nghiệp
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.to} to={card.to} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-300 h-full">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {card.title}
                      </h2>
                      <p className="text-gray-600 mb-4">{card.description}</p>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
