import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{ background: "#f1f5f9", borderTop: "1px solid rgba(39,187,210,0.1)" }}>
      {/* Gradient divider top */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1,#27bbd2)" }} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                <Briefcase size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Career
                <span style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Nest
                </span>
              </span>
            </div>
            <p className="text-sm text-[#94a3b8] mb-5 leading-relaxed">
              Connecting talented individuals with top companies and career opportunities across India.
            </p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg border border-[#27bbd2]/20 text-[#94a3b8] hover:text-[#27bbd2] hover:border-[#27bbd2]/50 hover:bg-[#27bbd2]/5 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-4">For Job Seekers</h2>
            <ul className="text-sm space-y-3">
              {[["Browse Jobs", "/jobs"], ["Create Profile", "/profile"], ["Career Advice", "/career-advice"], ["Saved Jobs", "/saved-jobs"]].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-[#94a3b8] hover:text-[#27bbd2] transition-colors flex items-center gap-2">
                    <span className="text-[#27bbd2] text-xs">→</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-4">For Employers</h2>
            <ul className="text-sm space-y-3">
              {[["Post a Job", "/admin/jobs/create"], ["Browse Candidates", "admin/jobs"], ["Recruitment Solutions", "/recruitment"], ["Contact Support", "/contact"]].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-[#94a3b8] hover:text-[#f59e0b] transition-colors flex items-center gap-2">
                    <span className="text-[#f59e0b] text-xs">→</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-4">Contact Us</h2>
            <ul className="text-sm space-y-3">
              <li className="flex items-start gap-2 text-[#94a3b8]">
                <MapPin size={14} className="mt-0.5 text-[#6366f1] shrink-0" />
                <span>42, Sector 18, Noida, UP 201301</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#27bbd2] shrink-0" />
                <a href="mailto:support@careernest.com" className="text-[#94a3b8] hover:text-[#27bbd2] transition-colors">
                  support@careernest.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#f59e0b] shrink-0" />
                <a href="tel:+919119078783" className="text-[#94a3b8] hover:text-[#f59e0b] transition-colors">
                  +91 9119078783
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6" style={{ borderColor: "rgba(39,187,210,0.15)" }}>
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[#94a3b8] gap-4">
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
