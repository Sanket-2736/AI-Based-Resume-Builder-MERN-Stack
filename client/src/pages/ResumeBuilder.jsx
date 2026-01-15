import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadCloudIcon,
  EyeClosedIcon,
  EyeIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User
} from 'lucide-react'

import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'

import { useSelector } from 'react-redux'
import api from '../congifs/api'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {
  const { token } = useSelector(state => state.auth)
  const { resumeId } = useParams()

  console.log("📌 Resume Builder Loaded")
  console.log("Resume ID from URL:", resumeId)
  console.log("Auth Token:", token)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    template: 'classic',
    accent_color: '#3b82f6',
    public: false,
    personal_info: {
      full_name: '',
      profession: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      image: ''
    },
    professional_summary: '',
    experience: [],
    education: [],
    project: [],
    skills: [],
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'skills', name: 'Skills', icon: Sparkles }
  ]

  // ================= LOAD RESUME ===================
  const loadExsistingData = async () => {
    try {
      console.log("🔄 Loading resume from backend...")
      console.log("➡ GET /api/resumes/get/" + resumeId)

      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: { Authorization: token }
      })

      console.log("✅ Resume API Response:", data)

      if (data.resume) {
        console.log("📥 Hydrating resume state...")

        setResumeData(prev => ({
          ...prev,
          ...data.resume,
          personal_info: {
            ...prev.personal_info,
            ...data.resume.personal_info
          },
          experience: data.resume.experience || [],
          education: data.resume.education || [],
          project: data.resume.project || [],
          skills: data.resume.skills || []
        }))

        document.title = data.resume.title
      }
    } catch (error) {
      console.error("❌ Failed to load resume:", error)
      toast.error('Internal server error')
    }
  }

  // ================= SAVE RESUME ===================
  const saveResume = async () => {
    try {
      console.log("💾 Saving resume...")
      console.log("Resume Data:", resumeData)

      const formdata = new FormData()
      formdata.append('resumeId', resumeId)
      formdata.append('resumeData', JSON.stringify(resumeData))

      if (removeBackground) {
        console.log("🧼 Remove background enabled")
        formdata.append('removeBackground', 'yes')
      }

      if (typeof resumeData.personal_info.image === 'object') {
        console.log("📤 Uploading image:", resumeData.personal_info.image)
        formdata.append('image', resumeData.personal_info.image)
      }

      const { data } = await api.put('/api/resumes/update', formdata, {
        headers: { Authorization: token }
      })

      console.log("✅ Save API Response:", data)

      setResumeData(data.resume)
      toast.success(data.message)
    } catch (error) {
      console.error("❌ Save failed:", error)
      toast.error('Internal server error!')
    }
  }

  // ================= VISIBILITY ===================
  const changeResumeVisibility = async () => {
    try {
      console.log("👁 Toggling visibility...")

      const formdata = new FormData()
      formdata.append('resumeId', resumeId)
      formdata.append('resumeData', JSON.stringify({ public: !resumeData.public }))

      const { data } = await api.put('/api/resumes/update', formdata, {
        headers: { Authorization: token }
      })

      console.log("✅ Visibility API Response:", data)

      setResumeData(prev => ({ ...prev, public: !prev.public }))
      toast.success(data.message)
    } catch (error) {
      console.error("❌ Visibility change failed:", error)
      toast.error('Internal server error')
    }
  }

  // ================= SHARE ===================
  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0]
    const resumeUrl = frontendUrl + '/view/' + resumeId

    console.log("🔗 Share URL:", resumeUrl)

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My resume' })
    } else {
      alert('Share not supported on this browser!')
    }
  }

  // ================= DOWNLOAD ===================
  const downloadResume = () => {
    console.log("⬇ Download triggered")
    window.print()
  }

  useEffect(() => {
    console.log("🚀 Resume Builder Mounted")
    loadExsistingData()
  }, [])

  const activeSection = sections[activeSectionIndex]

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700' to='/app'>
          <ArrowLeftIcon className='size-4' /> Back to dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='grid lg:grid-cols-12 gap-8'>

          {/* LEFT PANEL */}
          <div className='lg:col-span-5 bg-white rounded-lg shadow-sm border p-6'>
            <div className='flex justify-between items-center mb-6 border-b pb-2'>
              <div className='flex gap-2'>
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onChange={(template) => {
                    console.log("🎨 Template changed:", template)
                    setResumeData(prev => ({ ...prev, template }))
                  }}
                />
                <ColorPicker
                  selectedColor={resumeData.accent_color}
                  onChange={(color) => {
                    console.log("🎨 Accent color changed:", color)
                    setResumeData(prev => ({ ...prev, accent_color: color }))
                  }}
                />
              </div>

              <div className='flex gap-2'>
                {activeSectionIndex > 0 && (
                  <button
                    onClick={() => {
                      console.log("⬅ Prev section")
                      setActiveSectionIndex(i => i - 1)
                    }}
                    className='px-3 py-2 rounded bg-gray-100'
                  >
                    <ChevronLeft className='size-4' />
                  </button>
                )}

                {activeSectionIndex < sections.length - 1 && (
                  <button
                    onClick={() => {
                      console.log("➡ Next section")
                      setActiveSectionIndex(i => i + 1)
                    }}
                    className='px-3 py-2 rounded bg-gray-100'
                  >
                    <ChevronRight className='size-4' />
                  </button>
                )}
              </div>
            </div>

            {/* FORMS */}
            {activeSection.id === 'personal' && (
              <PersonalInfoForm
                data={resumeData.personal_info}
                onChange={(data) => {
                  console.log("📝 Personal Info Updated:", data)
                  setResumeData(prev => ({ ...prev, personal_info: data }))
                }}
                removeBackground={removeBackground}
                setRemoveBackground={setRemoveBackground}
              />
            )}

            {activeSection.id === 'summary' && (
              <ProfessionalSummaryForm
                data={resumeData.professional_summary}
                onChange={(value) => {
                  console.log("📝 Summary Updated:", value)
                  setResumeData(prev => ({ ...prev, professional_summary: value }))
                }}
              />
            )}

            {activeSection.id === 'experience' && (
              <ExperienceForm
                data={resumeData.experience}
                onChange={(value) => {
                  console.log("📝 Experience Updated:", value)
                  setResumeData(prev => ({ ...prev, experience: value }))
                }}
              />
            )}

            {activeSection.id === 'education' && (
              <EducationForm
                data={resumeData.education}
                onChange={(value) => {
                  console.log("📝 Education Updated:", value)
                  setResumeData(prev => ({ ...prev, education: value }))
                }}
              />
            )}

            {activeSection.id === 'projects' && (
              <ProjectForm
                data={resumeData.project}
                onChange={(value) => {
                  console.log("📝 Projects Updated:", value)
                  setResumeData(prev => ({ ...prev, project: value }))
                }}
              />
            )}

            {activeSection.id === 'skills' && (
              <SkillsForm
                data={resumeData.skills}
                onChange={(value) => {
                  console.log("📝 Skills Updated:", value)
                  setResumeData(prev => ({ ...prev, skills: value }))
                }}
              />
            )}

            <button
              onClick={() => toast.promise(saveResume(), { loading: 'Saving...' })}
              className='mt-6 px-6 py-2 bg-green-600 text-white rounded'
            >
              Save Changes
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className='lg:col-span-7'>
            <div className='flex justify-end gap-2 mb-4'>
              {resumeData.public && (
                <button onClick={handleShare} className='p-2 bg-blue-100 rounded'>
                  <Share2Icon className='size-4' />
                </button>
              )}

              <button onClick={changeResumeVisibility} className='p-2 bg-purple-100 rounded'>
                {resumeData.public ? <EyeIcon className='size-4' /> : <EyeClosedIcon className='size-4' />}
              </button>

              <button onClick={downloadResume} className='p-2 bg-green-100 rounded'>
                <DownloadCloudIcon className='size-4' />
              </button>
            </div>

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
