// app/components/ToastNotifications.tsx
import { Toaster, toast, ToastOptions } from "react-hot-toast";

const ToastNotifications: React.FC = () => {
  return (
    <div className="z-50">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={toastOptions} // Global Toast Options
      />
    </div>
  );
};

// Customize default toast options
const toastOptions: ToastOptions = {
  style: {
    backgroundColor: "#333", // Tailwind dark-gray bg
    color: "#fff",
    borderRadius: "0.375rem", // Tailwind's rounded-md
    padding: "1rem",
    fontSize: "1rem",
  },
  duration: 3000, // Default duration for all toasts
  removeDelay: 0, // No delay before toast removal
  ariaProps: {
    role: "status",
    "aria-live": "polite",
  },
  position: "top-right", // Default position
  iconTheme: {
    primary: "#fff",
    secondary: "#fff",
  },
};

// Universal Toast Function (to be used across the app)
export const showToast = (
  type: "success" | "error" | "info" | "loading",
  message: string
) => {
  const toastStyles = {
    success: {
      backgroundColor: "#008000", // Tailwind green-400 for success
      color: "#fff",
    },
    error: {
      backgroundColor: "#EF4444", // Tailwind red-500 for error
      color: "#fff",
    },
    info: {
      backgroundColor: "#2563EB", // Tailwind blue-600 for info
      color: "#fff",
    },
    loading: {
      backgroundColor: "#F59E0B", // Tailwind yellow-500 for loading
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
