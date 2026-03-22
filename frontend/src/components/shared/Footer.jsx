import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Briefcase, ArrowUpRight, ArrowUp, Send } from "lucide-react";
import { motion } from "framer-motion";

const FooterLink = ({ to, children, accent = "#27bbd2" }) => (
  <li>
    <Link to={to}>
      <motion.span
        className="flex items-center gap-2 text-[13px] text-[#64748b] cursor-pointer"
        whileHover={{ x: 4, color: accent }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <span
          className="inline-block h-px transition-all duration-300 rounded-full"
          style={{ width: 8, background: accent, opacity: 0.5 }}
        />
        {children}
      </motion.span>
    </Link>
  </li>
);

const SocialBtn = ({ Icon, href, color, label }) => (
  <motion.a
    href={href}
    aria-label={label}
    whileHover={{ scale: 1.18, y: -2 }}
    whileTap={{ scale: 0.92 }}
    transition={{ type: "spring", stiffness: 420, damping: 16 }}
    className="relative p-2.5 rounded-xl flex items-center justify-center"
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = `${color}1a`;
      e.currentTarget.style.borderColor = `${color}55`;
      e.currentTarget.style.boxShadow = `0 0 16px ${color}33`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <Icon size={15} style={{ color: "#64748b" }} />
  </motion.a>
);

const ContactRow = ({ icon: Icon, iconColor, iconBg, href, children }) => (
  <motion.a
    href={href}
    whileHover={{ x: 3 }}
    transition={{ type: "spring", stiffness: 380, damping: 22 }}
    className="flex items-center gap-3 p-3 rounded-xl transition-colors duration-200"
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = `${iconColor}33`; e.currentTarget.style.background = `${iconColor}08`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
  >
    <div className="p-1.5 rounded-lg shrink-0" style={{ background: iconBg }}>
      <Icon size={12} style={{ color: iconColor }} />
    </div>
    <span className="text-[12.5px] text-[#64748b] leading-snug">{children}</span>
    {href !== "#" && <ArrowUpRight size={10} className="ml-auto shrink-0 opacity-30" />}
  </motion.a>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden" style={{ background: "#080f1e" }}>

      {/* ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle,#27bbd2,transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -top-20 right-0 w-80 h-80 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle,#6366f1,transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse,#27bbd2,transparent 70%)", filter: "blur(40px)" }} />
      </div>

      {/* gradient top border */}
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,transparent 0%,#27bbd2 30%,#6366f1 60%,#f59e0b 80%,transparent 100%)" }} />

      {/* glassmorphism inner surface */}
      <div className="relative" style={{ backdropFilter: "blur(2px)" }}>
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">

          {/* main grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-4 space-y-5">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="p-2 rounded-xl" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", boxShadow: "0 0 20px rgba(39,187,210,0.3)" }}>
                  <Briefcase size={17} className="text-white" />
                </div>
                <span className="text-[22px] font-extrabold text-white tracking-[-0.02em]">
                  Career
                  <span style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Nest
                  </span>
                </span>
              </Link>

              <p className="text-[13px] text-[#475569] leading-[1.8] max-w-[280px]">
                Connecting talented individuals with top companies and career opportunities across India.
              </p>

              {/* social icons */}
              <div className="flex gap-2">
                <SocialBtn Icon={Twitter}   href="#" color="#1da1f2" label="Twitter" />
                <SocialBtn Icon={Linkedin}  href="#" color="#0a66c2" label="LinkedIn" />
                <SocialBtn Icon={Instagram} href="#" color="#e1306c" label="Instagram" />
                <SocialBtn Icon={Facebook}  href="#" color="#1877f2" label="Facebook" />
              </div>

              {/* newsletter */}
              <div>
                <p className="text-[11px] font-semibold text-[#475569] uppercase tracking-widest mb-2.5">Stay Updated</p>
                {subscribed ? (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[12.5px] text-[#27bbd2] font-medium"
                  >
                    ✓ You're subscribed!
                  </motion.p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 px-3 py-2 rounded-xl text-[12.5px] text-white outline-none min-w-0"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = "rgba(39,187,210,0.5)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      className="p-2 rounded-xl shrink-0"
                      style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", boxShadow: "0 0 14px rgba(39,187,210,0.25)" }}
                    >
                      <Send size={13} className="text-white" />
                    </motion.button>
                  </form>
                )}
              </div>
            </div>

            {/* Job Seekers */}
            <div className="md:col-span-2">
              <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-5">Job Seekers</h3>
              <ul className="space-y-3.5">
                <FooterLink to="/jobs">Browse Jobs</FooterLink>
                <FooterLink to="/profile">My Profile</FooterLink>
                <FooterLink to="/career-advice">Career Advice</FooterLink>
                <FooterLink to="/saved-jobs">Saved Jobs</FooterLink>
                <FooterLink to="/browse">Explore</FooterLink>
              </ul>
            </div>

            {/* Employers */}
            <div className="md:col-span-2">
              <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-5">Employers</h3>
              <ul className="space-y-3.5">
                <FooterLink to="/admin/jobs/create" accent="#f59e0b">Post a Job</FooterLink>
                <FooterLink to="/admin/jobs"        accent="#f59e0b">Manage Jobs</FooterLink>
                <FooterLink to="/admin/companies"   accent="#f59e0b">Companies</FooterLink>
                <FooterLink to="/recruitment"       accent="#f59e0b">Recruitment</FooterLink>
                <FooterLink to="/contact"           accent="#f59e0b">Support</FooterLink>
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-4">
              <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-5">Get in Touch</h3>
              <div className="space-y-2.5">
                <ContactRow icon={MapPin} iconColor="#6366f1" iconBg="rgba(99,102,241,0.15)" href="#">
                  42, Sector 18, Noida, UP 201301
                </ContactRow>
                <ContactRow icon={Mail} iconColor="#27bbd2" iconBg="rgba(39,187,210,0.15)" href="mailto:support@careernest.com">
                  support@careernest.com
                </ContactRow>
                <ContactRow icon={Phone} iconColor="#f59e0b" iconBg="rgba(245,158,11,0.15)" href="tel:+919119078783">
                  +91 9119078783
                </ContactRow>
              </div>
            </div>
          </div>

          {/* animated divider */}
          <div className="relative mb-6 overflow-hidden h-px">
            <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.06)" }} />
            <motion.div
              className="absolute inset-y-0 w-32 rounded-full"
              style={{ background: "linear-gradient(90deg,transparent,rgba(39,187,210,0.6),transparent)" }}
              animate={{ x: ["-10%", "110%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            />
          </div>

          {/* bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-[#334155]">
              © {new Date().getFullYear()} CareerNest. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-[12px] text-[#334155]"
                  whileHover={{ color: "#27bbd2" }}
                  transition={{ duration: 0.15 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* back to top */}
            <motion.button
              onClick={scrollTop}
              whileHover={{ scale: 1.1, y: -2, boxShadow: "0 0 20px rgba(39,187,210,0.35)" }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-semibold text-[#27bbd2]"
              style={{ background: "rgba(39,187,210,0.08)", border: "1px solid rgba(39,187,210,0.2)" }}
            >
              <ArrowUp size={12} strokeWidth={2.5} /> Back to top
            </motion.button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
