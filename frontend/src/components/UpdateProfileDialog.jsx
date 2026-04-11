import React, { useCallback, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { Check, Loader2, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import { setUser } from '@/redux/authSlice'
import api from '@/utils/axiosInstance'
import { USER_API_END_POINT } from '@/utils/constant'

import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    if (!url.startsWith('blob:')) img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });

const revokeObjectUrl = (url) => {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const cropX = Math.max(0, Math.floor(pixelCrop.x));
  const cropY = Math.max(0, Math.floor(pixelCrop.y));
  const cropWidth = Math.max(1, Math.min(image.naturalWidth - cropX, Math.floor(pixelCrop.width)));
  const cropHeight = Math.max(1, Math.min(image.naturalHeight - cropY, Math.floor(pixelCrop.height)));
  const outputSize = Math.min(Math.max(cropWidth, cropHeight), 400);

  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, outputSize, outputSize);
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas is empty'))),
      'image/jpeg',
      0.92
    );
  });
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
});

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth ?? {});
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skillTags, setSkillTags] = useState(user?.profile?.skills || []);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState(buildInputState(user));
  const [photoPreview, setPhotoPreview] = useState(user?.profile?.profilephoto || '');
  const [cropSrc, setCropSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const skillRef = useRef(null);
  const photoInputRef = useRef(null);
  const photoFileRef = useRef(null);
  const prevOpenRef = useRef(false);
  const cropObjectUrlRef = useRef(null);
  const previewObjectUrlRef = useRef(null);

  const persistProfile = async ({
    photoFile = null,
    removePhoto = false,
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
    }

    formData.append('removePhoto', String(removePhoto));
    if (photoFile) formData.append('photo', photoFile);

    setLoading(true);
    try {
      const res = await api.post(`${USER_API_END_POINT}/profile/update`, formData);

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        photoFileRef.current = null;
        setPhotoPreview(res.data.user?.profile?.profilephoto || '');
        setInput((prev) => ({
          ...prev,
          file: includeAllFields ? null : prev.file,
          photo: null,
          removePhoto: false,
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

  const resetCropState = useCallback(() => {
    revokeObjectUrl(cropObjectUrlRef.current);
    cropObjectUrlRef.current = null;
    setCropSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1.2);
    setCroppedAreaPixels(null);
    setIsCropping(false);
  }, []);

  const resetDialogState = useCallback(() => {
    revokeObjectUrl(previewObjectUrlRef.current);
    previewObjectUrlRef.current = null;
    photoFileRef.current = null;
    setInput(buildInputState(user));
    setSkillInput('');
    setSkillTags(user?.profile?.skills || []);
    setShowSuggestions(false);
    setPhotoPreview(user?.profile?.profilephoto || '');
    resetCropState();
  }, [resetCropState, user]);

  React.useEffect(() => {
    if (open && !prevOpenRef.current) {
      resetDialogState();
    }

    if (!open && prevOpenRef.current) {
      resetCropState();
    }

    prevOpenRef.current = open;
  }, [open, resetDialogState, resetCropState]);

  React.useEffect(() => () => {
    revokeObjectUrl(previewObjectUrlRef.current);
    revokeObjectUrl(cropObjectUrlRef.current);
  }, []);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const fileChangeHandler = (e) => {
    setInput((prev) => ({ ...prev, file: e.target.files?.[0] || null }));
  };

  const photoChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file.');
      e.target.value = '';
      return;
    }

    revokeObjectUrl(cropObjectUrlRef.current);
    const url = URL.createObjectURL(file);
    cropObjectUrlRef.current = url;
    setCropSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1.2);
    setCroppedAreaPixels(null);
    setInput((prev) => ({ ...prev, photo: null, removePhoto: false }));
    e.target.value = '';
  };

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels) {
      toast.error('Please adjust the crop area first.');
      return;
    }

    try {
      setIsCropping(true);
      const blob = await getCroppedImg(cropSrc, croppedAreaPixels);
      const croppedFile = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(blob);

      revokeObjectUrl(previewObjectUrlRef.current);
      previewObjectUrlRef.current = previewUrl;
      photoFileRef.current = croppedFile;

      setInput((prev) => ({ ...prev, photo: croppedFile, removePhoto: false }));
      setPhotoPreview(previewUrl);
      resetCropState();
      await persistProfile({
        photoFile: croppedFile,
        removePhoto: false,
        includeAllFields: false,
        successMessage: 'Profile photo updated successfully.',
        closeDialog: false,
      });
    } catch (error) {
      console.error('Crop error:', error);
      if (!error?.response) {
        toast.error('Failed to crop image. Please try again.');
      }
      setIsCropping(false);
    }
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

    if (cropSrc) {
      toast.error('Apply or cancel the crop before updating your profile.');
      return;
    }

    try {
      await persistProfile({
        photoFile: photoFileRef.current || input.photo,
        removePhoto: input.removePhoto,
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
  const hasPhoto = Boolean(photoPreview || user?.profile?.profilephoto || photoFileRef.current || input.photo);
  const handleRemovePhoto = () => {
    revokeObjectUrl(previewObjectUrlRef.current);
    previewObjectUrlRef.current = null;
    photoFileRef.current = null;
    resetCropState();
    setPhotoPreview('');
    setInput((prev) => ({ ...prev, photo: null, removePhoto: true }));
    persistProfile({
      photoFile: null,
      removePhoto: true,
      includeAllFields: false,
      successMessage: 'Profile photo removed successfully.',
      closeDialog: false,
    }).catch(() => {
      setPhotoPreview(user?.profile?.profilephoto || '');
      setInput((prev) => ({ ...prev, removePhoto: false }));
    });
  };

  return (
    <div>
      {cropSrc && (
        <div
          className="fixed inset-0 flex flex-col overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.95)', zIndex: 1000 }}
        >
          <div className="relative w-full" style={{ height: 'calc(100vh - 140px)' }}>
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              minZoom={0.8}
              maxZoom={5}
              aspect={1}
              cropShape="round"
              showGrid={false}
              objectFit="cover"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              onMediaLoaded={({ height, naturalHeight, naturalWidth }) => {
                const isPortrait = naturalHeight > naturalWidth;
                setZoom(isPortrait ? 0.95 : 0.9);
                setCrop({ x: 0, y: isPortrait ? -Math.min(height * 0.08, 60) : 0 });
              }}
              style={{
                containerStyle: { width: '100%', height: '100%', background: '#000' },
              }}
            />
          </div>

          <div
            className="flex flex-col items-center gap-4 px-6 py-5"
            style={{ background: 'rgba(15,23,42,0.95)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm font-semibold text-white">Drag to reposition · Pinch or scroll to zoom</p>

            <div className="flex items-center gap-3 w-full max-w-xs">
              <ZoomOut size={16} className="text-white/50 shrink-0" />
              <input
                id="crop-zoom"
                name="crop-zoom"
                type="range"
                min={0.8}
                max={5}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-[#27bbd2]"
              />
              <ZoomIn size={16} className="text-white/50 shrink-0" />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetCropState}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
              >
                <RotateCcw size={14} /> Cancel
              </button>
              <button
                type="button"
                onClick={handleCropConfirm}
                disabled={isCropping}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg,#27bbd2,#6366f1)', color: '#fff' }}
              >
                {isCropping ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {isCropping ? 'Applying...' : 'Apply Crop'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                <Input id="file" name="file" type="file" accept="application/pdf" onChange={fileChangeHandler} className="sm:col-span-3" />
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
    </div>
  );
};

export default UpdateProfileDialog;
