import ImageConverter from "./components/ImageConverter";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <ImageConverter />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // Default options
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Success
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          // Error
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
          // Loading
          loading: {
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;
