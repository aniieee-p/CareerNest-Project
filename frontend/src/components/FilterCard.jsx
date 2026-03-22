import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { MapPin, Briefcase, IndianRupee, X, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const filterData = [
  {
    filterType: "Location",
    icon: MapPin,
    color: "#27bbd2",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    icon: Briefcase,
    color: "#6366f1",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    icon: IndianRupee,
    color: "#f59e0b",
    array: ["0-40k", "42k-1L", "1L-5L"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue((prev) => (prev === value ? "" : value));
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  return (
    <div
      className="w-full rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(39,187,210,0.18)",
        boxShadow: "0 4px 24px rgba(39,187,210,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#27bbd2]" />
          <h1 className="font-bold text-gray-900 text-sm">Filters</h1>
        </div>
        {selectedValue && (
          <button
            onClick={() => setSelectedValue("")}
            className="flex items-center gap-1 text-xs text-[#94a3b8] hover:text-red-400 transition-colors"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div className="space-y-5">
        {filterData.map(({ filterType, icon: Icon, color, array }, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-3">
              <Icon size={13} style={{ color }} />
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                {filterType}
              </h2>
            </div>
            <div className="space-y-2">
              {array.map((item, idx) => {
                const active = selectedValue === item;
                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => changeHandler(item)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all"
                    style={{
                      background: active ? `rgba(39,187,210,0.1)` : "transparent",
                      color: active ? "#27bbd2" : "#475569",
                      border: active ? "1px solid rgba(39,187,210,0.3)" : "1px solid transparent",
                    }}
                  >
                    <span
                      className="h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                      style={{
                        borderColor: active ? "#27bbd2" : "#cbd5e1",
                        background: active ? "#27bbd2" : "transparent",
                      }}
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    {item}
                  </motion.button>
                );
              })}
            </div>
            {index < filterData.length - 1 && (
              <div className="mt-4 border-t" style={{ borderColor: "rgba(39,187,210,0.1)" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
