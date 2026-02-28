import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const Toasts = ({ message, type = "success", duration = 2500, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const styles =
    type === "success"
      ? {
          bg: "bg-green-600",
          text: "text-white",
          icon: "text-white",
          close: "text-white/80 hover:text-white",
        }
      : {
          bg: "bg-red-600",
          text: "text-white",
          icon: "text-white",
          close: "text-white/80 hover:text-white",
        };

  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div
      className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-4 ${styles.bg} ${styles.text} rounded-2xl shadow-xl min-w-[280px] animate-slide-in`}
    >
      <Icon size={20} className={`${styles.icon} flex-shrink-0`} />

      <p className="text-sm font-semibold flex-1">
        {message}
      </p>

      <button
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className={`${styles.close} transition-colors`}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toasts;