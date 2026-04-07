import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { CONTACT_API_END_POINT } from '@/utils/constant'

const ContactSupport = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [loading, setLoading] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post(`${CONTACT_API_END_POINT}/send`, form)
            if (res.data.success) {
                toast.success("Message sent! We'll get back to you soon.")
                setForm({ name: '', email: '', message: '' })
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send message.")
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = {
        background: "var(--cn-input-bg)",
        borderColor: "var(--cn-input-border)",
        color: "var(--cn-text-1)",
        outline: "none",
        transition: "border-color 0.2s",
    }

    return (
        <div style={{ background: "var(--cn-page)", minHeight: "100vh" }}>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-12'>
                <h1 className='text-2xl sm:text-4xl font-bold mb-2' style={{ color: "var(--cn-text-1)" }}>
                    Contact <span className='text-[#27bbd2]'>Support</span>
                </h1>
                <p className='mb-8 sm:mb-10' style={{ color: "var(--cn-text-2)" }}>Have a question? We're here to help.</p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10'>
                    {/* Contact Info */}
                    <div className='flex flex-col gap-6'>
                        {[
                            { icon: MapPin, label: "Address", value: "42, Sector 18, Noida, UP 201301" },
                            { icon: Mail, label: "Email", value: "support@careernest.com" },
                            { icon: Phone, label: "Phone", value: "+91 9119078783" },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className='flex items-start gap-4'>
                                <div className='p-3 rounded-full' style={{ background: "rgba(39,187,210,0.1)" }}>
                                    <Icon size={18} className='text-[#27bbd2]' />
                                </div>
                                <div>
                                    <p className='text-xs' style={{ color: "var(--cn-text-3)" }}>{label}</p>
                                    <p className='text-sm font-medium' style={{ color: "var(--cn-text-1)" }}>{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={submitHandler} className='flex flex-col gap-4'>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                            className='border rounded-lg px-4 py-3 text-sm'
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = "#27bbd2"}
                            onBlur={e => e.target.style.borderColor = "var(--cn-input-border)"}
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                            className='border rounded-lg px-4 py-3 text-sm'
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = "#27bbd2"}
                            onBlur={e => e.target.style.borderColor = "var(--cn-input-border)"}
                        />
                        <textarea
                            placeholder="Your Message"
                            rows={5}
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                            required
                            className='border rounded-lg px-4 py-3 text-sm resize-none'
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = "#27bbd2"}
                            onBlur={e => e.target.style.borderColor = "var(--cn-input-border)"}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className='text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70'
                            style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
                        >
                            {loading ? <><Loader2 size={16} className='animate-spin' /> Sending...</> : <><Send size={16} /> Send Message</>}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ContactSupport
