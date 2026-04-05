import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--cn-page)", color: "var(--cn-text-1)" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <p className="text-8xl font-black" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          404
        </p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--cn-text-3)" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
            style={{ borderColor: "var(--cn-border-subtle)", color: "var(--cn-text-2)" }}
          >
            <ArrowLeft size={15} /> Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
          >
            <Home size={15} /> Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
