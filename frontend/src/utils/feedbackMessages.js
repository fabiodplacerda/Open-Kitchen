import { toast, Bounce } from "react-toastify";

const showFeedbackMessage = (type, message, time = 2100) => {
  toast[type](message, {
    position: "bottom-right",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};

export default showFeedbackMessage;
