import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Company Info */}
        <div>
          <h1 className="text-xl font-bold">
            Career<span className="text-[#27bbd2]">Nest</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Connecting talented individuals with top companies and career opportunities.
          </p>
        </div>

        {/* Job Seekers */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">For Job Seekers</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><a href="#" className="hover:text-[#27bbd2]">Browse Jobs</a></li>
            <li><a href="#" className="hover:text-[#27bbd2]">Create Profile</a></li>
            <li><a href="#" className="hover:text-[#27bbd2]">Career Advice</a></li>
            <li><a href="#" className="hover:text-[#27bbd2]">Saved Jobs</a></li>
          </ul>
        </div>

        {/* Employers */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">For Employers</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><a href="#" className="hover:text-[#27bbd2]">Post a Job</a></li>
            <li><a href="#" className="hover:text-[#27bbd2]">Browse Candidates</a></li>
            <li><a href="#" className="hover:text-[#27bbd2]">Recruitment Solutions</a></li>
            <li><a href="#" className="hover:text-[#27bbd2]">Contact Support</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="text-center text-sm text-gray-500 pb-6">
        © {new Date().getFullYear()} CareerNest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
