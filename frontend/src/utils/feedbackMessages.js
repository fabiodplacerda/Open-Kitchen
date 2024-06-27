import { toast, Bounce } from "react-toastify";

const showFeedbackMessage = (type, message, time = 1900) => {
  toast[type](message, {
    position: "top-right",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
};

export default showFeedbackMessage;
