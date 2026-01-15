import { 
    BriefcaseBusinessIcon, 
    Globe, 
    Linkedin, 
    Mail, 
    MapPin, 
    Phone, 
    User, 
    Camera,
    Upload,
    X,
    Check,
    ExternalLink,
    Eye,
    EyeOff,
    Shield,
    Award,
    Sparkles
} from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isValidating, setIsValidating] = useState(false);
    const fileInputRef = useRef(null);

    const fields = [
        { key: 'full_name', label: 'Full Name', icon: User, type: 'text', required: true, maxLength: 50 },
        { key: 'email', label: 'Email Address', icon: Mail, type: 'email', required: true },
        { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', pattern: '^[+]?[0-9\\s-()]{10,}$' },
        { key: 'location', label: 'Location', icon: MapPin, type: 'text', placeholder: 'City, Country' },
        { key: 'profession', label: 'Profession / Title', icon: BriefcaseBusinessIcon, type: 'text', maxLength: 60 },
        { key: 'linkedin', label: 'LinkedIn Profile', icon: Linkedin, type: 'url', placeholder: 'https://linkedin.com/in/username' },
        { key: 'website', label: 'Personal Website', icon: Globe, type: 'url', placeholder: 'https://yourwebsite.com' },
    ];

    // Handle image preview
    useEffect(() => {
        if (data.image) {
            if (typeof data.image === 'string') {
                setImagePreview(data.image);
            } else {
                const preview = URL.createObjectURL(data.image);
                setImagePreview(preview);
                return () => URL.revokeObjectURL(preview);
            }
        } else {
            setImagePreview(null);
        }
    }, [data.image]);

    const handleChange = (field, val) => {
        const newData = { ...data, [field]: val };
        onChange(newData);
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        // Auto-validate email
        if (field === 'email' && val) {
            validateEmail(val, field);
        }
    };

    const validateEmail = (email, field) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrors(prev => ({ ...prev, [field]: 'Please enter a valid email address' }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, image: 'Please upload a JPG, PNG, or WebP image' }));
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
                return;
            }

            handleChange('image', file);
            setErrors(prev => ({ ...prev, image: '' }));
        }
    };

    const removeImage = () => {
        handleChange('image', '');
        setRemoveBackground(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateField = (field, value) => {
        const newErrors = { ...errors };
        
        if (field.required && !value) {
            newErrors[field.key] = `${field.label} is required`;
        } else if (field.key === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[field.key] = 'Please enter a valid email address';
        } else if (field.key === 'phone' && value && !/^[+]?[0-9\s-()]{10,}$/.test(value)) {
            newErrors[field.key] = 'Please enter a valid phone number';
        } else if (field.key === 'linkedin' && value && !value.includes('linkedin.com')) {
            newErrors[field.key] = 'Please enter a valid LinkedIn URL';
        } else if (field.key === 'website' && value && !value.startsWith('http')) {
            newErrors[field.key] = 'Please include http:// or https://';
        } else {
            delete newErrors[field.key];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getCompletionPercentage = () => {
        const requiredFields = fields.filter(f => f.required);
        const filledRequired = requiredFields.filter(f => data[f.key]?.trim()).length;
        return Math.round((filledRequired / requiredFields.length) * 100);
    };

    const completionPercentage = getCompletionPercentage();

    return (
        <div className="space-y-8">
            {/* Header with Progress */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <User className="w-5 h-5 text-blue-600" />
                        Personal Information
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-700">
                            {completionPercentage}% Complete
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${
                                    completionPercentage === 100 ? 'bg-green-500' :
                                    completionPercentage >= 70 ? 'bg-blue-500' :
                                    completionPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-600">
                    This information will appear at the top of your resume. Make sure it's accurate and professional.
                </p>
            </div>

            {/* Profile Image Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-900">Profile Photo</label>
                    <span className="text-xs text-gray-500">Optional • Max 5MB</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Image Preview */}
                    <div className="relative">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-16 h-16 text-gray-400" />
                                </div>
                            )}
                            
                            {/* Image Quality Indicator */}
                            {imagePreview && (
                                <div className="absolute top-2 right-2">
                                    <div className="p-1.5 bg-green-500 text-white rounded-full">
                                        <Check className="w-3 h-3" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Remove Image Button */}
                        {imagePreview && (
                            <button
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-4">
                        <div className="space-y-3">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow"
                            >
                                <Upload className="w-4 h-4" />
                                {imagePreview ? 'Change Photo' : 'Upload Photo'}
                            </button>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg, image/jpg, image/png, image/webp"
                                className="hidden"
                                onChange={handleImageUpload}
                            />

                            <p className="text-xs text-gray-500">
                                Recommended: Square image, professional attire, good lighting
                            </p>
                        </div>

                        {/* Background Removal Toggle */}
                        {data.image && (
                            <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Sparkles className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Remove Background</p>
                                            <p className="text-xs text-gray-500">Professional headshot mode</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={removeBackground}
                                            onChange={(e) => setRemoveBackground(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                                {removeBackground && (
                                    <p className="text-xs text-green-600 mt-2">
                                        <Check className="w-3 h-3 inline mr-1" />
                                        Background will be automatically removed from your photo
                                    </p>
                                )}
                            </div>
                        )}

                        {errors.image && (
                            <p className="text-sm text-red-600">{errors.image}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => {
                    const Icon = field.icon;
                    const error = errors[field.key];
                    const value = data[field.key] || '';

                    return (
                        <div key={field.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                    <Icon className="w-4 h-4" />
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                
                                {/* Character Counter */}
                                {field.maxLength && (
                                    <span className={`text-xs ${value.length > field.maxLength ? 'text-red-500' : 'text-gray-500'}`}>
                                        {value.length}/{field.maxLength}
                                    </span>
                                )}
                            </div>

                            <div className="relative">
                                <input
                                    type={field.type}
                                    value={value}
                                    className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                        error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                    } ${field.icon === Phone ? 'pl-12' : 'pl-10'}`}
                                    placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
                                    required={field.required}
                                    maxLength={field.maxLength}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    onBlur={(e) => validateField(field, e.target.value)}
                                />
                                
                                <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                                    error ? 'text-red-400' : 'text-gray-400'
                                }`} />

                                {/* Validation Status */}
                                {value && !error && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <Check className="w-4 h-4 text-green-500" />
                                    </div>
                                )}
                            </div>

                            {error && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                    <X className="w-3 h-3" />
                                    {error}
                                </p>
                            )}

                            {/* Helper Text */}
                            {field.key === 'email' && !error && value && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Email format looks good
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Privacy & Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Privacy Notice */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-2">Privacy & Security</h4>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Your information is stored securely and never shared with third parties</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Only include contact information you're comfortable sharing</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Consider using a professional email address</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Professional Tips */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-900 mb-2">Professional Tips</h4>
                            <ul className="space-y-2 text-sm text-green-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">•</span>
                                    <span>Use your full legal name as it appears on official documents</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">•</span>
                                    <span>Keep your profession/title concise (3-5 words max)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">•</span>
                                    <span>Ensure all links are up-to-date and professional</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Completion Status */}
            {completionPercentage === 100 ? (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-green-900">All required information complete!</p>
                            <p className="text-sm text-green-700">Your personal information is ready for your resume.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-blue-900">Complete your profile</p>
                            <p className="text-sm text-blue-700">
                                Fill in the required fields marked with * to reach 100% completion
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInfoForm;