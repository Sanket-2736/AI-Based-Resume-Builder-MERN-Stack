import { Plus, Trash2 } from 'lucide-react';
import React from 'react'

const ProjectForm = ({data, onChange}) => {

    const addProject = () => {
        const newProject = {
            name : '',
            type : '',
            description : '',
        }

        onChange([...data, newProject]);
    }

    const removeProject = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    }

    const updateProject = (index, field, val) => {
        const updated = [...data];
        updated[index] = {...updated[index], [field] : val}
        onChange(updated);
    }
  return (
    <div className='space-y-6'>
      <div className='items-center flex justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold'>Projects</h3>
                <p className='text-sm text-gray-500'>Add your projects.</p>
            </div>

            <button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'>
                <Plus className='size-4'/>
                Add Project
            </button>
        </div>

        <div className='space-y-4 mt-6'>
            {data.map((project, index) => {
                return (
                    <div className='p-4 border border-gray-200 rounded-lg space-y-3' key={index}>
                        <div className='flex justify-between items-center'>
                            <h4>Project #{index + 1}</h4>
                            <button className='text-red-500 hover:text-red-700 transition-colors' onClick={() => removeProject(index)}>
                                <Trash2 className='size-4' />
                            </button>
                        </div>

                        <div className='grid gap-3'>
                            <input type='text'
                            placeholder='Name'
                            value={project.name || ''}
                            className='px-3 py-2 text-sm rounded-lg'
                            onChange={(e) => updateProject(index, 'name', e.target.value)} />

                            <input type='text'
                            placeholder='Type'
                            className='px-3 py-2 text-sm'
                            value={project.type || ''}
                            onChange={(e) => updateProject(index, 'type', e.target.value)} />

                            <textarea type='text'
                            placeholder='Describe your project..'
                            rows={4}
                            className='px-3 py-2 text-sm rounded-lg'
                            value={project.description || ''}
                            onChange={(e) => updateProject(index, 'description', e.target.value)} />

                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default ProjectForm