import { Toaster, toast, ToastOptions } from "react-hot-toast";

const ToastNotifications: React.FC = () => {
  return (
    <div className="z-50 ">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={toastOptions}
      />
    </div>
  );
};

// Customize default toast options
const toastOptions: ToastOptions = {
  style: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: "4px",
    padding: "8px 20px",
    fontSize: "15px",
    width: "300px",
  },
  duration: 3000,
  removeDelay: 0,
  ariaProps: {
    role: "status",
    "aria-live": "polite",
  },
  position: "top-right",
};

// Universal Toast Function (to be used across the app)
export const showToast = (
  type: "success" | "error" | "info" | "loading",
  message: string
) => {
  const toastStyles = {
    success: {
      backgroundColor: "#34c724",
      color: "#fff",
    },
    error: {
      backgroundColor: "#f54a45",
      color: "#fff",
    },
    info: {
      backgroundColor: "#2563EB",
      color: "#fff",
    },
    loading: {
      backgroundColor: "#F59E0B",
      color: "#fff",
    },
  };

  // Use the toast methods based on the type
  switch (type) {
    case "success":
      toast.success(message, {
        ...toastOptions,
        style: {
          ...toastOptions.style,
          ...toastStyles.success,
        },
      });
      break;
    case "error":
      toast.error(message, {
        ...toastOptions,
        style: {
          ...toastOptions.style,
          ...toastStyles.error,
        },
      });
      break;
    case "info":
      toast(message, {
        ...toastOptions,
        icon: "ℹ️", // Optional info icon
        style: {
          ...toastOptions.style,
          ...toastStyles.info,
        },
      });
      break;
    case "loading":
      toast.loading(message, {
        ...toastOptions,
        style: {
          ...toastOptions.style,
          ...toastStyles.loading,
        },
      });
      break;
  }
};

export default ToastNotifications;
