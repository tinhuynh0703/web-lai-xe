import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ROUTES } from "./constants";
import { Layout } from "./components/layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AddCoursePage from "./pages/AddCoursePage";
import AddStudentPage from "./pages/AddStudentPage";
import EditStudentPage from "./pages/EditStudentPage";
import ScheduleCenterPage from "./pages/ScheduleCenterPage";
import TuitionProfilesPage from "./pages/TuitionProfilesPage";
import TuitionPaymentHistoryPage from "./pages/TuitionPaymentHistoryPage";
import NhatKyChungTuPage from "./pages/NhatKyChungTuPage";
import CanDoiTaiKhoanPage from "./pages/CanDoiTaiKhoanPage";
import LichSuNopHocPhiPage from "./pages/LichSuNopHocPhiPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route index element={<HomePage />} />
                  <Route path="khoa-hoc/them" element={<AddCoursePage />} />
                  <Route path="hoc-vien/them" element={<AddStudentPage />} />
                  <Route
                    path="hoc-vien/chinh-sua/:maDK"
                    element={<EditStudentPage />}
                  />
                  <Route path="lich-hoc" element={<ScheduleCenterPage />} />
                  <Route
                    path="ke-toan/ho-so-hoc-phi"
                    element={<TuitionProfilesPage />}
                  />
                  <Route
                    path="ke-toan/ho-so-hoc-phi/:maDK"
                    element={<TuitionPaymentHistoryPage />}
                  />
                  <Route
                    path="ke-toan/nhat-ky-chung-tu"
                    element={<NhatKyChungTuPage />}
                  />
                  <Route
                    path="ke-toan/can-doi-tai-khoan"
                    element={<CanDoiTaiKhoanPage />}
                  />
                  <Route
                    path="ke-toan/lich-su-nop-hoc-phi"
                    element={<LichSuNopHocPhiPage />}
                  />
                  <Route path="cai-dat" element={<SettingsPage />} />
                  <Route
                    path="*"
                    element={<Navigate to={ROUTES.HOME} replace />}
                  />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
