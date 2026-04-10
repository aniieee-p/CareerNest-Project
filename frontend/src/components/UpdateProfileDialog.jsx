import React, { useState, useRef, useCallback } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, X, ZoomIn, ZoomOut, Check, RotateCcw } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import api from '@/utils/axiosInstance'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import Cropper from 'react-easy-crop'

// ── helpers ──────────────────────────────────────────────────────────────────

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
};

// ── skill map ─────────────────────────────────────────────────────────────────

const SKILL_MAP = {
    react: ["React.js", "Redux", "React Router", "Next.js", "Tailwind CSS", "JavaScript"],
    frontend: ["HTML", "CSS", "JavaScript", "React.js", "Vue.js", "Tailwind CSS", "Bootstrap"],
    backend: ["Node.js", "Express.js", "REST APIs", "MongoDB", "PostgreSQL", "MySQL"],
    fullstack: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "JavaScript"],
    python: ["Python", "Django", "Flask", "Pandas", "NumPy", "Machine Learning"],
    data: ["Python", "SQL", "Pandas", "NumPy", "Machine Learning", "TensorFlow", "Power BI"],
    java: ["Java", "Spring Boot", "Hibernate", "MySQL", "REST APIs", "Maven"],
    devops: ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Linux", "Terraform"],
    android: ["Kotlin", "Java", "Android SDK", "Firebase", "REST APIs", "XML"],
    ml: ["Python", "TensorFlow", "Scikit-learn", "Pandas", "NumPy", "Deep Learning"],
    ui: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research", "CSS"],
    cloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform"],
    testing: ["Selenium", "Jest", "Manual Testing", "Postman", "JUnit", "Cypress"],
};

const getSuggestionsFromProfile = (bio = "", existingSkills = []) => {
    const text = bio.toLowerCase();
    const suggested = new Set();
    Object.entries(SKILL_MAP).forEach(([keyword, skills]) => {
        if (text.includes(keyword)) skills.forEach(s => suggested.add(s));
    });
    return [...suggested].filter(s => !existingSkills.includes(s));
};

// ── component ─────────────────────────────────────────────────────────────────

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth ?? {});
    const [skillInput, setSkillInput] = useState("");
    const [skillTags, setSkillTags] = useState(user?.profile?.skills || []);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const skillRef = useRef(null);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        file: null,
        photo: null,
    });
    const [photoPreview, setPhotoPreview] = useState(user?.profile?.profilephoto || "");

    // cropper state
    const [cropSrc, setCropSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const dispatch = useDispatch();

    const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    const fileChangeHandler = (e) => setInput({ ...input, file: e.target.files?.[0] });

    const photoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setCropSrc(url);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        // reset input so same file can be re-selected
        e.target.value = "";
    };

    const onCropComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), []);

    const handleCropConfirm = async () => {
        try {
            const blob = await getCroppedImg(cropSrc, croppedAreaPixels);
            const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
            setInput(prev => ({ ...prev, photo: file }));
            setPhotoPreview(URL.createObjectURL(blob));
            setCropSrc(null);
        } catch {
            toast.error("Failed to crop image.");
        }
    };

    const profileSuggestions = getSuggestionsFromProfile(input.bio || user?.profile?.bio, skillTags);
    const filteredSuggestions = skillInput.trim()
        ? profileSuggestions.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()))
        : profileSuggestions.slice(0, 8);

    const addSkill = (skill) => {
        if (!skillTags.includes(skill)) setSkillTags([...skillTags, skill]);
        setSkillInput("");
        setShowSuggestions(false);
        skillRef.current?.focus();
    };
    const removeSkill = (skill) => setSkillTags(skillTags.filter(s => s !== skill));

    const handleSkillKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
            e.preventDefault();
            addSkill(skillInput.trim());
        }
        if (e.key === "Backspace" && !skillInput && skillTags.length > 0)
            removeSkill(skillTags[skillTags.length - 1]);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phonenumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", skillTags.join(","));
        if (input.file) formData.append("file", input.file);
        if (input.photo) formData.append("photo", input.photo);
        try {
            setLoading(true);
            const res = await api.post(`${USER_API_END_POINT}/profile/update`, formData);
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
        setOpen(false);
    };

    return (
        <div>
            {/* ── Crop modal ── */}
            {cropSrc && (
                <div className="fixed inset-0 z-100 flex flex-col" style={{ background: "rgba(0,0,0,0.92)" }}>
                    {/* cropper area */}
                    <div className="relative flex-1">
                        <Cropper
                            image={cropSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="round"
                            showGrid={false}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>

                    {/* controls */}
                    <div className="flex flex-col items-center gap-4 px-6 py-5"
                        style={{ background: "rgba(15,23,42,0.95)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                        <p className="text-sm font-semibold text-white">Drag to reposition · Pinch or scroll to zoom</p>

                        {/* zoom slider */}
                        <div className="flex items-center gap-3 w-full max-w-xs">
                            <ZoomOut size={16} className="text-white/50 shrink-0" />
                            <input type="range" min={1} max={3} step={0.05} value={zoom}
                                onChange={e => setZoom(Number(e.target.value))}
                                className="flex-1 accent-[#27bbd2]" />
                            <ZoomIn size={16} className="text-white/50 shrink-0" />
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setCropSrc(null)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                                style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}>
                                <RotateCcw size={14} /> Cancel
                            </button>
                            <button onClick={handleCropConfirm}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                                style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", color: "#fff" }}>
                                <Check size={14} /> Apply Crop
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Profile dialog ── */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            {/* Profile Photo */}
                            <div className='flex flex-col items-center gap-2 mb-2'>
                                <div className='relative group cursor-pointer' onClick={() => document.getElementById('photo-upload').click()}>
                                    <img
                                        src={photoPreview || `https://ui-avatars.com/api/?name=${user?.fullname}&background=e0f7fa&color=00838f`}
                                        alt="profile"
                                        className='h-20 w-20 rounded-full object-cover border-2 border-[#27bbd2]'
                                    />
                                    <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                        <span className='text-white text-xs font-medium'>Change</span>
                                    </div>
                                </div>
                                <input id="photo-upload" type="file" accept="image/*" className='hidden' onChange={photoChangeHandler} />
                                <span className='text-xs' style={{ color: "var(--cn-text-3)" }}>Click photo to change</span>
                            </div>

                            {[
                                { id: "name",   label: "Name",  name: "name",        type: "text",  value: input.fullname },
                                { id: "email",  label: "Email", name: "email",       type: "email", value: input.email },
                                { id: "number", label: "Phone", name: "phoneNumber", type: "text",  value: input.phoneNumber },
                                { id: "bio",    label: "Bio",   name: "bio",         type: "text",  value: input.bio },
                            ].map(({ id, label, name, type, value }) => (
                                <div key={id} className='flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-1 sm:gap-4'>
                                    <Label htmlFor={id} className="sm:text-right text-sm font-medium">{label}</Label>
                                    <Input id={id} name={name} type={type} value={value} onChange={changeEventHandler} className="sm:col-span-3" />
                                </div>
                            ))}

                            {/* Skills */}
                            <div className='flex flex-col sm:grid sm:grid-cols-4 sm:items-start gap-1 sm:gap-4'>
                                <Label htmlFor="skills" className="sm:text-right sm:mt-2 text-sm font-medium">Skills</Label>
                                <div className="sm:col-span-3 relative">
                                    <div className="flex flex-wrap gap-1 mb-1">
                                        {skillTags.map(skill => (
                                            <span key={skill} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                                                style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.2)" }}>
                                                {skill}
                                                <X size={12} className="cursor-pointer" onClick={() => removeSkill(skill)} />
                                            </span>
                                        ))}
                                    </div>
                                    <Input ref={skillRef} id="skills" placeholder="Type a skill and press Enter..."
                                        value={skillInput}
                                        onChange={e => { setSkillInput(e.target.value); setShowSuggestions(true); }}
                                        onKeyDown={handleSkillKeyDown}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                        autoComplete="off" />
                                    {showSuggestions && filteredSuggestions.length > 0 && (
                                        <div className="absolute z-50 w-full rounded-md shadow-md mt-1 max-h-40 overflow-y-auto"
                                            style={{ background: "var(--cn-popover)", border: "1px solid var(--cn-border)" }}>
                                            {filteredSuggestions.map(s => (
                                                <div key={s} className="px-3 py-2 text-sm cursor-pointer transition-colors"
                                                    style={{ color: "var(--cn-text-2)" }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = "var(--cn-surface-hover)"; e.currentTarget.style.color = "#27bbd2"; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--cn-text-2)"; }}
                                                    onMouseDown={() => addSkill(s)}>
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Resume */}
                            <div className='flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-1 sm:gap-4'>
                                <Label htmlFor="file" className="sm:text-right text-sm font-medium">Resume</Label>
                                <Input id="file" name="file" type="file" accept="application/pdf" onChange={fileChangeHandler} className="sm:col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            {loading
                                ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button>
                                : <Button type="submit" className="w-full my-4">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UpdateProfileDialog;
