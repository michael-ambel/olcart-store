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
    padding: "12px 14px",
    fontSize: "15px",
    width: "420px",
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
  message: string,
) => {
  const toastStyles = {
    success: {
      backgroundColor: "#fff",
      color: "#34c724",
    },
    error: {
      backgroundColor: "#fff",
      color: "#ed4337",
    },
    info: {
      backgroundColor: "#fff",
      color: "#2563EB",
    },
    loading: {
      backgroundColor: "#fff",
      color: "#F59E0B",
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
