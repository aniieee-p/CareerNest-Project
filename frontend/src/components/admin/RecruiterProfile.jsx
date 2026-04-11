import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { User, Mail, Phone, Building2, Calendar, Edit3 } from 'lucide-react';

const RecruiterProfile = () => {
  const { user } = useSelector(store => store.auth);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--cn-page-alt)" }}>
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto px-4 pt-20 pb-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--cn-text-1)" }}>
            Recruiter Profile
          </h1>
          <p className="text-sm" style={{ color: "var(--cn-text-3)" }}>
            Manage your recruiter account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl p-6 mb-6" style={{ 
          background: "var(--cn-surface)", 
          border: "1px solid var(--cn-border)",
          boxShadow: "var(--cn-card-shadow)"
        }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user?.profile?.profilePhoto}
                  alt={user?.fullname}
                />
                <AvatarFallback className="bg-[#27bbd2] text-white text-xl">
                  {user?.fullname?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--cn-text-1)" }}>
                  {user?.fullname}
                </h2>
                <p className="text-sm mb-2" style={{ color: "var(--cn-text-3)" }}>
                  Recruiter
                </p>
                <div className="flex items-center text-xs px-2 py-1 rounded-full" style={{ 
                  background: "rgba(39,187,210,0.1)", 
                  color: "#27bbd2" 
                }}>
                  <Building2 className="h-3 w-3 mr-1" />
                  Recruiter Account
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: "var(--cn-text-2)" }}>
                  <User className="h-4 w-4 mr-2" />
                  Full Name
                </label>
                <div className="p-3 rounded-lg" style={{ 
                  background: "var(--cn-input-bg)", 
                  border: "1px solid var(--cn-border-input)",
                  color: "var(--cn-text-1)"
                }}>
                  {user?.fullname || 'Not provided'}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: "var(--cn-text-2)" }}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </label>
                <div className="p-3 rounded-lg" style={{ 
                  background: "var(--cn-input-bg)", 
                  border: "1px solid var(--cn-border-input)",
                  color: "var(--cn-text-1)"
                }}>
                  {user?.email || 'Not provided'}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: "var(--cn-text-2)" }}>
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </label>
                <div className="p-3 rounded-lg" style={{ 
                  background: "var(--cn-input-bg)", 
                  border: "1px solid var(--cn-border-input)",
                  color: "var(--cn-text-1)"
                }}>
                  {user?.phoneNumber || 'Not provided'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: "var(--cn-text-2)" }}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Company
                </label>
                <div className="p-3 rounded-lg" style={{ 
                  background: "var(--cn-input-bg)", 
                  border: "1px solid var(--cn-border-input)",
                  color: "var(--cn-text-1)"
                }}>
                  {user?.profile?.company || 'Not specified'}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: "var(--cn-text-2)" }}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Member Since
                </label>
                <div className="p-3 rounded-lg" style={{ 
                  background: "var(--cn-input-bg)", 
                  border: "1px solid var(--cn-border-input)",
                  color: "var(--cn-text-1)"
                }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "var(--cn-text-2)" }}>
                  Bio
                </label>
                <div className="p-3 rounded-lg min-h-[80px]" style={{ 
                  background: "var(--cn-input-bg)", 
                  border: "1px solid var(--cn-border-input)",
                  color: "var(--cn-text-1)"
                }}>
                  {user?.profile?.bio || 'No bio provided'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl text-center" style={{ 
            background: "var(--cn-surface)", 
            border: "1px solid var(--cn-border)" 
          }}>
            <Building2 className="h-8 w-8 mx-auto mb-2 text-[#27bbd2]" />
            <h3 className="font-semibold mb-1" style={{ color: "var(--cn-text-1)" }}>
              Companies
            </h3>
            <p className="text-xs mb-3" style={{ color: "var(--cn-text-3)" }}>
              Manage your companies
            </p>
            <Button 
              size="sm" 
              className="w-full bg-[#27bbd2] hover:bg-[#1fa8be]"
              onClick={() => window.location.href = '/admin/companies'}
            >
              View Companies
            </Button>
          </div>

          <div className="p-4 rounded-xl text-center" style={{ 
            background: "var(--cn-surface)", 
            border: "1px solid var(--cn-border)" 
          }}>
            <User className="h-8 w-8 mx-auto mb-2 text-[#27bbd2]" />
            <h3 className="font-semibold mb-1" style={{ color: "var(--cn-text-1)" }}>
              Job Posts
            </h3>
            <p className="text-xs mb-3" style={{ color: "var(--cn-text-3)" }}>
              Manage job listings
            </p>
            <Button 
              size="sm" 
              className="w-full bg-[#27bbd2] hover:bg-[#1fa8be]"
              onClick={() => window.location.href = '/admin/jobs'}
            >
              View Jobs
            </Button>
          </div>

          <div className="p-4 rounded-xl text-center" style={{ 
            background: "var(--cn-surface)", 
            border: "1px solid var(--cn-border)" 
          }}>
            <Edit3 className="h-8 w-8 mx-auto mb-2 text-[#27bbd2]" />
            <h3 className="font-semibold mb-1" style={{ color: "var(--cn-text-1)" }}>
              Settings
            </h3>
            <p className="text-xs mb-3" style={{ color: "var(--cn-text-3)" }}>
              Account preferences
            </p>
            <Button 
              size="sm" 
              variant="outline"
              className="w-full"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecruiterProfile;