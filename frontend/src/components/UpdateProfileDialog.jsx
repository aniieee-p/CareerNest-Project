import React, { useCallback, useRef, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import { setUser } from '@/redux/authSlice'
import api from '@/utils/axiosInstance'
import { USER_API_END_POINT } from '@/utils/constant'

import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

const revokeObjectUrl = (url) => {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

const SKILL_MAP = {
  react: ['React.js', 'Redux', 'React Router', 'Next.js', 'Tailwind CSS', 'JavaScript'],
  frontend: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Vue.js', 'Tailwind CSS', 'Bootstrap'],
  backend: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'PostgreSQL', 'MySQL'],
  fullstack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JavaScript'],
  python: ['Python', 'Django', 'Flask', 'Pandas', 'NumPy', 'Machine Learning'],
  data: ['Python', 'SQL', 'Pandas', 'NumPy', 'Machine Learning', 'TensorFlow', 'Power BI'],
  java: ['Java', 'Spring Boot', 'Hibernate', 'MySQL', 'REST APIs', 'Maven'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Linux', 'Terraform'],
  android: ['Kotlin', 'Java', 'Android SDK', 'Firebase', 'REST APIs', 'XML'],
  ml: ['Python', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'Deep Learning'],
  ui: ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research', 'CSS'],
  cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform'],
  testing: ['Selenium', 'Jest', 'Manual Testing', 'Postman', 'JUnit', 'Cypress'],
};

const getSuggestionsFromProfile = (bio = '', existingSkills = []) => {
  const text = bio.toLowerCase();
  const suggested = new Set();

  Object.entries(SKILL_MAP).forEach(([keyword, skills]) => {
    if (text.includes(keyword)) skills.forEach((skill) => suggested.add(skill));
  });

  return [...suggested].filter((skill) => !existingSkills.includes(skill));
};

const buildInputState = (user) => ({
  fullname: user?.fullname || '',
  email: user?.email || '',
  phoneNumber: user?.phoneNumber || '',
  bio: user?.profile?.bio || '',
  file: null,
  photo: null,
  removePhoto: false,
  removeResume: false,
});

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth ?? {});
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skillTags, setSkillTags] = useState(user?.profile?.skills || []);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState(buildInputState(user));
  const [photoPreview, setPhotoPreview] = useState(user?.profile?.profilephoto || '');

  const skillRef = useRef(null);
  const photoInputRef = useRef(null);
  const prevOpenRef = useRef(false);
  const previewObjectUrlRef = useRef(null);

  const persistProfile = async ({
    removePhoto = false,
    removeResume = false,
    includeAllFields = false,
    successMessage = 'Profile updated successfully',
    closeDialog = false,
  } = {}) => {
    const formData = new FormData();

    if (includeAllFields) {
      formData.append('fullname', input.fullname);
      formData.append('email', input.email);
      formData.append('phonenumber', input.phoneNumber);
      formData.append('bio', input.bio);
      formData.append('skills', skillTags.join(','));
      if (input.file) formData.append('file', input.file);
      if (input.photo) formData.append('photo', input.photo);
    }

    formData.append('removePhoto', String(removePhoto));
    formData.append('removeResume', String(removeResume));

    setLoading(true);
    try {
      const res = await api.post(`${USER_API_END_POINT}/profile/update`, formData);

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        setPhotoPreview(res.data.user?.profile?.profilephoto || '');
        setInput((prev) => ({
          ...prev,
          file: includeAllFields ? null : prev.file,
          photo: null,
          removePhoto: false,
          removeResume: false,
        }));
        toast.success(successMessage);
        if (closeDialog) setOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update profile.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetDialogState = useCallback(() => {
    revokeObjectUrl(previewObjectUrlRef.current);
    previewObjectUrlRef.current = null;
    setInput(buildInputState(user));
    setSkillInput('');
    setSkillTags(user?.profile?.skills || []);
    setShowSuggestions(false);
    setPhotoPreview(user?.profile?.profilephoto || '');
  }, [user]);

  React.useEffect(() => {
    if (open && !prevOpenRef.current) {
      resetDialogState();
    }

    prevOpenRef.current = open;
  }, [open, resetDialogState]);

  React.useEffect(() => () => {
    revokeObjectUrl(previewObjectUrlRef.current);
  }, []);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const fileChangeHandler = (e) => {
    setInput((prev) => ({
      ...prev,
      file: e.target.files?.[0] || null,
      removeResume: false,
    }));
  };

  const photoChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file.');
      e.target.value = '';
      return;
    }

    revokeObjectUrl(previewObjectUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = previewUrl;

    setPhotoPreview(previewUrl);
    setInput((prev) => ({
      ...prev,
      photo: file,
      removePhoto: false,
    }));

    toast.success('Photo selected. Click Update to save it.');
    e.target.value = '';
  };

  const addSkill = (skill) => {
    if (!skillTags.includes(skill)) {
      setSkillTags((prev) => [...prev, skill]);
    }

    setSkillInput('');
    setShowSuggestions(false);
    skillRef.current?.focus();
  };

  const removeSkill = (skillToRemove) => {
    setSkillTags((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSkillKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim());
    }

    if (e.key === 'Backspace' && !skillInput && skillTags.length > 0) {
      removeSkill(skillTags[skillTags.length - 1]);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await persistProfile({
        removePhoto: input.removePhoto,
        removeResume: input.removeResume,
        includeAllFields: true,
        successMessage: 'Profile updated successfully',
        closeDialog: true,
      });
      revokeObjectUrl(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    } catch {
      // Error toast is handled in persistProfile.
    }
  };

  const profileSuggestions = getSuggestionsFromProfile(input.bio || user?.profile?.bio, skillTags);
  const filteredSuggestions = skillInput.trim()
    ? profileSuggestions.filter((skill) => skill.toLowerCase().includes(skillInput.toLowerCase()))
    : profileSuggestions.slice(0, 8);
  const hasPhoto = Boolean(photoPreview || user?.profile?.profilephoto || input.photo);
  const hasResume = Boolean(input.file || user?.profile?.resume);
  const resumeLabel = input.file?.name || user?.profile?.resumeOriginalName || 'Resume uploaded';

  const handleRemovePhoto = () => {
    revokeObjectUrl(previewObjectUrlRef.current);
    previewObjectUrlRef.current = null;
    setPhotoPreview('');
    setInput((prev) => ({ ...prev, photo: null, removePhoto: true }));
    persistProfile({
      removePhoto: true,
      removeResume: false,
      includeAllFields: false,
      successMessage: 'Profile photo removed successfully.',
      closeDialog: false,
    }).catch(() => {
      setPhotoPreview(user?.profile?.profilephoto || '');
      setInput((prev) => ({ ...prev, removePhoto: false }));
    });
  };

  const handleRemoveResume = () => {
    setInput((prev) => ({ ...prev, file: null, removeResume: true }));
    persistProfile({
      removePhoto: false,
      removeResume: true,
      includeAllFields: false,
      successMessage: 'Resume removed successfully.',
      closeDialog: false,
    }).catch(() => {
      setInput((prev) => ({ ...prev, removeResume: false }));
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-[calc(100vw-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription className="sr-only">
            Update your profile information including photo, name, bio and skills
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitHandler} autoComplete="off">
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="relative group cursor-pointer" onClick={() => photoInputRef.current?.click()}>
                <img
                  src={photoPreview || `https://ui-avatars.com/api/?name=${user?.fullname}&background=e0f7fa&color=00838f`}
                  alt="profile"
                  className="h-20 w-20 rounded-full object-cover border-2 border-[#27bbd2]"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </div>
              <input
                ref={photoInputRef}
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={photoChangeHandler}
              />
              <span className="text-xs" style={{ color: 'var(--cn-text-3)' }}>
                Click photo to change
              </span>
              {hasPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs font-medium text-rose-500 hover:text-rose-600"
                >
                  Remove photo
                </button>
              )}
            </div>

            {[
              { id: 'name', label: 'Name', name: 'fullname', type: 'text', value: input.fullname },
              { id: 'email', label: 'Email', name: 'email', type: 'email', value: input.email },
              { id: 'number', label: 'Phone', name: 'phoneNumber', type: 'text', value: input.phoneNumber },
              { id: 'bio', label: 'Bio', name: 'bio', type: 'text', value: input.bio },
            ].map(({ id, label, name, type, value }) => (
              <div key={id} className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-1 sm:gap-4">
                <Label htmlFor={id} className="sm:text-right text-sm font-medium">
                  {label}
                </Label>
                <Input id={id} name={name} type={type} value={value} onChange={changeEventHandler} className="sm:col-span-3" />
              </div>
            ))}

            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-start gap-1 sm:gap-4">
              <Label htmlFor="skills" className="sm:text-right sm:mt-2 text-sm font-medium">
                Skills
              </Label>
              <div className="sm:col-span-3 relative">
                <div className="flex flex-wrap gap-1 mb-1">
                  {skillTags.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                      style={{
                        background: 'rgba(39,187,210,0.1)',
                        color: '#27bbd2',
                        border: '1px solid rgba(39,187,210,0.2)',
                      }}
                    >
                      {skill}
                      <X size={12} className="cursor-pointer" onClick={() => removeSkill(skill)} />
                    </span>
                  ))}
                </div>
                <Input
                  ref={skillRef}
                  id="skills"
                  placeholder="Type a skill and press Enter..."
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={handleSkillKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  autoComplete="off"
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div
                    className="absolute z-50 w-full rounded-md shadow-md mt-1 max-h-40 overflow-y-auto"
                    style={{ background: 'var(--cn-popover)', border: '1px solid var(--cn-border)' }}
                  >
                    {filteredSuggestions.map((skill) => (
                      <div
                        key={skill}
                        className="px-3 py-2 text-sm cursor-pointer transition-colors"
                        style={{ color: 'var(--cn-text-2)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--cn-surface-hover)';
                          e.currentTarget.style.color = '#27bbd2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--cn-text-2)';
                        }}
                        onMouseDown={() => addSkill(skill)}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-1 sm:gap-4">
              <Label htmlFor="file" className="sm:text-right text-sm font-medium">
                Resume
              </Label>
              <div className="sm:col-span-3 space-y-2">
                <Input id="file" name="file" type="file" accept="application/pdf" onChange={fileChangeHandler} />
                {hasResume && (
                  <div
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs"
                    style={{ borderColor: 'var(--cn-border)', color: 'var(--cn-text-2)' }}
                  >
                    <span className="truncate">{resumeLabel}</span>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="shrink-0 font-medium text-rose-500 hover:text-rose-600"
                    >
                      Remove resume
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Update
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
