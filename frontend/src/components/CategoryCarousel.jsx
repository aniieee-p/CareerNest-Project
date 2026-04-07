import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { motion } from 'framer-motion';
import { Code2, Layout, Server, BarChart2, Palette, Smartphone, Cloud, Brain } from 'lucide-react';

const categories = [
  { label: "Full Stack",     icon: Code2,     bg: "bg-[#27bbd2]/10",  icon_color: "text-[#27bbd2]",  border: "border-[#27bbd2]/20"  },
  { label: "Frontend",       icon: Layout,    bg: "bg-[#6366f1]/10",  icon_color: "text-[#6366f1]",  border: "border-[#6366f1]/20"  },
  { label: "Backend",        icon: Server,    bg: "bg-[#f59e0b]/10",  icon_color: "text-[#f59e0b]",  border: "border-[#f59e0b]/20"  },
  { label: "Data Scientist", icon: BarChart2, bg: "bg-[#10b981]/10",  icon_color: "text-[#10b981]",  border: "border-[#10b981]/20"  },
  { label: "UI/UX Designer", icon: Palette,   bg: "bg-[#6366f1]/10",  icon_color: "text-[#6366f1]",  border: "border-[#6366f1]/20"  },
  { label: "Mobile App",     icon: Smartphone,bg: "bg-[#f59e0b]/10",  icon_color: "text-[#f59e0b]",  border: "border-[#f59e0b]/20"  },
  { label: "DevOps",         icon: Cloud,     bg: "bg-[#27bbd2]/10",  icon_color: "text-[#27bbd2]",  border: "border-[#27bbd2]/20"  },
  { label: "AI / ML",        icon: Brain,     bg: "bg-[#10b981]/10",  icon_color: "text-[#10b981]",  border: "border-[#10b981]/20"  },
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="max-w-7xl mx-auto my-10 sm:my-16 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: "var(--cn-text-1)" }}>
        Browse by{" "}
        <span style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Category
        </span>
      </h2>
      <p className="text-center text-sm mb-8" style={{ color: "var(--cn-text-3)" }}>Find jobs that match your expertise</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map(({ label, icon: Icon, bg, icon_color, border }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => searchJobHandler(label)}
            className={`flex flex-col items-center gap-2 p-3 sm:p-5 rounded-xl border ${border} shadow-sm hover:shadow-md transition-all cursor-pointer group`}
            style={{ background: "var(--cn-card)", backdropFilter: "blur(12px)" }}
          >
            <div className={`p-2 sm:p-3 rounded-full ${bg} group-hover:scale-110 transition-transform`}>
              <Icon size={18} className={`sm:w-[22px] sm:h-[22px] ${icon_color}`} />
            </div>
            <span className="text-xs sm:text-sm font-medium text-center" style={{ color: "var(--cn-text-2)" }}>{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;
