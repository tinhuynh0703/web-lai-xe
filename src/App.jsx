import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ROUTES } from "./constants";
import { Layout } from "./components/layout";
import HomePage from "./pages/HomePage";
import AddCoursePage from "./pages/AddCoursePage";
import AddStudentPage from "./pages/AddStudentPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route index element={<HomePage />} />
                <Route path="khoa-hoc/them" element={<AddCoursePage />} />
                <Route path="hoc-vien/them" element={<AddStudentPage />} />
              </Routes>
            </Layout>
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
