import { Briefcase, Loader2, PlusCircle, Sparkles, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import api from '../congifs/api'

const ExperienceForm = ({ data, onChange }) => {
  const { token } = useSelector(state => state.auth)
  const [generatingIndex, setGeneratingIndex] = useState(-1)

  // ================= AI GENERATE =================
  const generateJobDescription = async (index) => {
    try {
      console.log("⚡ Generate Job Description clicked for index:", index)

      setGeneratingIndex(index)

      const experience = data[index]

      const prompt = `Enhance this job description: ${experience.description} for the role of ${experience.position} at ${experience.company}`

      console.log("📤 Prompt sent to AI:", prompt)

      const res = await api.post(
        `/api/ai/enhance-job-desc`,
        { userContent: prompt },
        { headers: { Authorization: token } }
      )

      console.log("✅ AI Response:", res.data)

      updateExperience(index, 'description', res.data.enhancedContent)
      toast.success(res.data.message)

    } catch (error) {
      console.error("❌ Error generating job description:", error)
      toast.error("Internal server error!")
    } finally {
      setGeneratingIndex(-1)
      console.log("🔁 Job description generation finished")
    }
  }

  // ================= CRUD =================
  const addExperience = () => {
    const newExperience = {
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      description: '',
      is_current: false
    }

    console.log("➕ Adding new experience")
    onChange([...data, newExperience])
  }

  const removeExperience = (index) => {
    console.log("🗑 Removing experience at index:", index)
    const updated = data.filter((_, i) => i !== index)
    onChange(updated)
  }

  const updateExperience = (index, field, val) => {
    console.log(`✏ Updating experience ${index} field ${field}:`, val)

    const updated = [...data]
    updated[index] = { ...updated[index], [field]: val }
    onChange(updated)
  }

  return (
    <div className='space-y-6'>
      {/* HEADER */}
      <div className='items-center flex justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold'>
            <Briefcase className='size-5' />
            Professional Experience
          </h3>
          <p className='text-sm text-gray-500'>Add your job experience.</p>
        </div>

        <button
          onClick={addExperience}
          className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'
        >
          <PlusCircle className='size-4' />
          Add Experience
        </button>
      </div>

      {/* EMPTY STATE */}
      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300' />
          <p>No work experience added yet.</p>
          <p className='text-sm'>Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((experience, index) => (
            <div
              key={index}
              className='p-4 border border-gray-200 rounded-lg space-y-3'
            >
              {/* HEADER */}
              <div className='flex justify-between items-center'>
                <h4 className='font-medium'>Experience #{index + 1}</h4>
                <button
                  className='text-red-500 hover:text-red-700 transition-colors'
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 className='size-4' />
                </button>
              </div>

              {/* INPUTS */}
              <div className='grid md:grid-cols-2 gap-3'>
                <input
                  type='text'
                  placeholder='Company Name'
                  value={experience.company || ''}
                  className='px-3 py-2 text-sm rounded-lg border'
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />

                <input
                  type='text'
                  placeholder='Job Title'
                  className='px-3 py-2 text-sm rounded-lg border'
                  value={experience.position || ''}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                />

                <input
                  type='month'
                  placeholder='Start date'
                  className='px-3 py-2 text-sm rounded-lg border'
                  value={experience.start_date || ''}
                  onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                />

                <input
                  type='month'
                  placeholder='End date'
                  className='px-3 py-2 text-sm rounded-lg border disabled:bg-gray-200'
                  disabled={experience.is_current}
                  value={experience.end_date || ''}
                  onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                />
              </div>

              {/* CURRENT JOB */}
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={experience.is_current || false}
                  onChange={(e) =>
                    updateExperience(index, 'is_current', e.target.checked)
                  }
                  className='rounded border-gray-300 text-green-600'
                />
                <span className='text-sm text-gray-600'>Currently working here</span>
              </label>

              {/* DESCRIPTION */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label className='text-sm font-medium text-gray-700'>
                    Job Description
                  </label>

                  <button
                    disabled={
                      generatingIndex === index ||
                      !experience.position ||
                      !experience.company
                    }
                    onClick={() => generateJobDescription(index)}
                    className='items-center flex gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'
                  >
                    {generatingIndex === index ? (
                      <Loader2 className='size-4 animate-spin' />
                    ) : (
                      <Sparkles className='w-3 h-3' />
                    )}
                    {generatingIndex === index ? 'Enhancing...' : 'Enhance with AI'}
                  </button>
                </div>

                <textarea
                  className='w-full text-sm px-3 py-2 rounded-lg resize-none border'
                  placeholder='Describe your key achievements and responsibilities...'
                  rows={4}
                  value={experience.description || ''}
                  onChange={(e) =>
                    updateExperience(index, 'description', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceForm
