import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)" }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <h1 className="text-2xl font-bold mb-4">
              Career
              <span style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Nest
              </span>
            </h1>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Connecting talented individuals with top companies and career opportunities across India.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg,#27bbd2,#6366f1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h2 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">For Job Seekers</h2>
            <ul className="text-sm space-y-3">
              {[["Browse Jobs", "/jobs"], ["Create Profile", "/profile"], ["Career Advice", "/career-advice"], ["Saved Jobs", "/saved-jobs"]].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-gray-400 hover:text-[#27bbd2] transition-colors flex items-center gap-2">
                    <span className="text-[#27bbd2] text-xs">→</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h2 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">For Employers</h2>
            <ul className="text-sm space-y-3">
              {[["Post a Job", "/admin/jobs/create"], ["Browse Candidates", "/admin/jobs"], ["Recruitment Solutions", "/recruitment"], ["Contact Support", "/contact"]].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-gray-400 hover:text-[#f59e0b] transition-colors flex items-center gap-2">
                    <span className="text-[#f59e0b] text-xs">→</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Contact Us</h2>
            <ul className="text-sm space-y-3">
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin size={15} className="mt-0.5 text-[#6366f1] shrink-0" />
                <span>42, Sector 18, Noida, UP 201301</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-[#27bbd2] shrink-0" />
                <a href="mailto:support@careernest.com" className="text-gray-400 hover:text-[#27bbd2] transition-colors">
                  support@careernest.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-[#f59e0b] shrink-0" />
                <a href="tel:+919119078783" className="text-gray-400 hover:text-[#f59e0b] transition-colors">
                  +91 9119078783
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
            <p>© {new Date().getFullYear()} CareerNest. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="hover:text-[#27bbd2] transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
