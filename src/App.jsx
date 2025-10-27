import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ImageConverter from "./components/ImageConverter";
import AuthPage from "./pages/AuthPage";
import ResetPassword from "./pages/ResetPassword";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ImageConverter />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: { background: "#363636", color: "#fff" },
          success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          loading: { iconTheme: { primary: "#3b82f6", secondary: "#fff" } },
        }}
      />
    </>
  );
}

export default App;
