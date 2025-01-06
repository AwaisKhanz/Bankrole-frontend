// src/utils/toast.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Toast Configuration
export const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  //   className: "toast-custom",
};
// Success Toast
export const showSuccessToast = (message) => {
  toast.success(message, toastConfig);
};

export const showErrorToast = (message) => {
  toast.error(message, toastConfig);
};

export const showInfoToast = (message) => {
  toast.info(message, toastConfig);
};

export const showWarningToast = (message) => {
  toast.warning(message, toastConfig);
};
