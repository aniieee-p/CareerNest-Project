import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email });
      if (res.data.success) {
        setSent(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <div className="w-1/2 border border-gray-200 rounded-md p-8 my-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Mail className="text-purple-600 w-6 h-6" />
            </div>
          </div>
          <h1 className="font-bold text-xl mb-2">Forgot Password?</h1>
          <p className="text-gray-500 text-sm mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          {sent ? (
            <p className="text-green-600 text-sm">
              Check your inbox for the reset link. It expires in 1 hour.
            </p>
          ) : (
            <form onSubmit={submitHandler}>
              <div className="text-left mb-4">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
              {loading ? (
                <Button className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Send Reset Link →
                </Button>
              )}
            </form>
          )}

          <div className="mt-4">
            <Link to="/login" className="text-sm text-blue-600">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
