import React, { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

// Skill suggestions mapped to keywords found in bio/designation
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
        if (text.includes(keyword)) {
            skills.forEach(s => suggested.add(s));
        }
    });
    // filter out already added skills
    return [...suggested].filter(s => !existingSkills.includes(s));
};

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
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
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const photoChangeHandler = (e) => {
        const photo = e.target.files?.[0];
        if (photo) {
            setInput({ ...input, photo });
            setPhotoPreview(URL.createObjectURL(photo));
        }
    }

    // Filter suggestions based on typed input + profile bio
    const profileSuggestions = getSuggestionsFromProfile(input.bio || user?.profile?.bio, skillTags);
    const filteredSuggestions = skillInput.trim()
        ? profileSuggestions.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()))
        : profileSuggestions.slice(0, 8);

    const addSkill = (skill) => {
        if (!skillTags.includes(skill)) {
            setSkillTags([...skillTags, skill]);
        }
        setSkillInput("");
        setShowSuggestions(false);
        skillRef.current?.focus();
    };

    const removeSkill = (skill) => {
        setSkillTags(skillTags.filter(s => s !== skill));
    };

    const handleSkillKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
            e.preventDefault();
            addSkill(skillInput.trim());
        }
        if (e.key === "Backspace" && !skillInput && skillTags.length > 0) {
            removeSkill(skillTags[skillTags.length - 1]);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phonenumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", skillTags.join(","));
        if (input.file) {
            formData.append("file", input.file);
        }
        if (input.photo) {
            formData.append("photo", input.photo);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
        setOpen(false);
    }



    return (
        <div>
            <Dialog open={open}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
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
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    className='hidden'
                                    onChange={photoChangeHandler}
                                />
                                <span className='text-xs text-gray-400'>Click photo to change</span>
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="number" className="text-right">Number</Label>
                                <Input
                                    id="number"
                                    name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-start gap-4'>
                                <Label htmlFor="skills" className="text-right mt-2">Skills</Label>
                                <div className="col-span-3 relative">
                                    {/* Skill tags */}
                                    <div className="flex flex-wrap gap-1 mb-1">
                                        {skillTags.map(skill => (
                                            <span key={skill} className="flex items-center gap-1 bg-[#e0f7fa] text-[#00838f] text-xs px-2 py-1 rounded-full">
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
                                        onChange={e => { setSkillInput(e.target.value); setShowSuggestions(true); }}
                                        onKeyDown={handleSkillKeyDown}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                        autoComplete="off"
                                    />
                                    {/* Suggestions dropdown */}
                                    {showSuggestions && filteredSuggestions.length > 0 && (
                                        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-40 overflow-y-auto">
                                            {filteredSuggestions.map(s => (
                                                <div
                                                    key={s}
                                                    className="px-3 py-2 text-sm cursor-pointer hover:bg-[#e0f7fa] hover:text-[#00838f]"
                                                    onMouseDown={() => addSkill(s)}
                                                >
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="file" className="text-right">Resume</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}


export default UpdateProfileDialog
