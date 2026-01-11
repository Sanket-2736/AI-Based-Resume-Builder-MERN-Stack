import { GraduationCapIcon, Plus, Trash2 } from 'lucide-react';
import React from 'react'

const EducationForm = ({data, onChange}) => {
    const addEducation = () => {
        const newEducation = {
            institution : '',
            degree : '',
            field : '',
            graduation_date : '',
            gpa : '',
        }

        onChange([...data, newEducation]);
    }

    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    }

    const updateEducation = (index, field, val) => {
        const updated = [...data];
        updated[index] = {...updated[index], [field] : val}
        onChange(updated);
    }
    
  return (
    <div className='space-y-6'>
      <div className='items-center flex justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold'>Education</h3>
                <p className='text-sm text-gray-500'>Add your education.</p>
            </div>

            <button onClick={addEducation} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'>
                <Plus className='size-4'/>
                Add Education
            </button>
        </div>

        {data.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
                <GraduationCapIcon className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                <p>No education details added yet.</p>
                <p className='text-sm'>Click "Add Education" to get started.</p>
            </div>
        ) : (
            <div className='space-y-4'>
                {data.map((education, index) => {
                    return (
                        <div className='p-4 border border-gray-200 rounded-lg space-y-3' key={index}>
                            <div className='flex justify-between items-center'>
                                <h4>Education #{index + 1}</h4>
                                <button className='text-red-500 hover:text-red-700 transition-colors' onClick={() => removeEducation(index)}>
                                    <Trash2 className='size-4' />
                                </button>
                            </div>

                            <div className='grid md:grid-cols-2 gap-3'>
                                <input type='text'
                                placeholder='Institution'
                                value={education.institution || ''}
                                className='px-3 py-2 text-sm'
                                onChange={(e) => updateEducation(index, 'institution', e.target.value)} />

                                <input type='text'
                                placeholder='Degree (E.g. B.E., B.Tech, etc.)'
                                className='px-3 py-2 text-sm'
                                value={education.degree || ''}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)} />

                                <input type='text'
                                placeholder='Field of Study'
                                className='px-3 py-2 text-sm'
                                value={education.field || ''}
                                onChange={(e) => updateEducation(index, 'field', e.target.value)} />

                                <input type='month'
                                placeholder='Graduation Date'
                                className='px-3 py-2 text-sm rounded-lg disabled:bg-gray-200'
                                value={education.graduation_date || ''}
                                onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)} />

                                <input type='text'
                                placeholder='GPA (Optional)'
                                value={education.gpa || ''}
                                onChange={(e) => updateEducation(index, 'gpa', e.target.value)} />

                            </div>
                        </div>
                    )
                })}
            </div>
        )}
    </div>
  )
}

export default EducationForm