import { FilePenLineIcon, LoaderCircle, LoaderCircleIcon, PencilIcon, PlusIcon, Trash2Icon, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyResumeData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../congifs/api';
import toast from 'react-hot-toast';
import pdfToText from 'react-pdftotext'

const Dashboard = () => {
  const {user, token} = useSelector(state => state.auth);
  const [allResumes, setAllResumes] = useState([]);
  const loadAllResumes = async () => {
    try {
      const {data} = await api.get('/api/users/resumes', {headers : {
        Authorization : token
      }});
      setAllResumes(data.resumes);
    } catch (error) {
      console.log(error)
      toast.error('Internal server error!')
    }
  }
  const [title, setTitle] = useState('');
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState('');
  const [showCreateResume, setShowCreateResume] = useState(true);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const navigate = useNavigate();

  const createResume = async (event) => {
    event.preventDefault();
    try {
      const {data} = await api.post('/api/resumes/create', {title}, {headers : {
        Authorization : token
      }});
      setAllResumes(prev => [...prev, data.resume]);
      setTitle('');
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      console.log(error)
      toast.error('Internal server error!')
    }
  }
  const [isLoading, setIsLoading]= useState(false);

  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const {data} = await api.post('/api/ai/upload-resume', {title, resumeText}, {headers : {
        Authorization : token
      }});
      setTitle('');
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      console.log(error)
      toast.error('Internal server error!')
    }
    setIsLoading(false);
  }

  const editTitle = async (event) => {
    event.preventDefault();
    try {
      const {data} = await api.put(`/api/resumes/update`, {resumeId : editResumeId, resumeData : {title}}, {headers : {
          Authorization: token
        }});

      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? {...resume, title} : resume));
      setTitle('');
      setEditResumeId('')
      toast.success(data.message);
    } catch (error) {
      console.log(Error);
      toast.error('Internal server error!');
    }
  }

  const deleteResume = async (resumeId) => {
    const confirm = window.confirm('Are you sure to delete this resume?');
    try {
      if(confirm){
        setAllResumes(prev => prev.filter(resume => resume._id !== resumeId));
        const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, {headers : {
          Authorization: token
        }});
        setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
        toast.success(data.message);
      }
    } catch (error) {
      console.log(Error);
      toast.error('Internal server error!');
    }
  }

  const colors = ['#9333ea', '#d97706', '#dc2626', '#0284c7', '#16a34a']

  useEffect(()=>{
    loadAllResumes()
  }, [])
  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden' >Welcome, John Doe</p>

      <div className='flex gap-4'>
        <button onClick={() => setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group group-hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
          <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 text-white to-indigo-500 rounded-full'/>
          <p className='text-sm group-hover:text-indigo-600 transition-all duration-300'>Create Resume</p>
        </button>

        <button onClick={()=>{setShowUploadResume(true)}} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group group-hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
          <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 text-white to-purple-500 rounded-full'/>
          <p className='text-sm group-hover:text-purple-600 transition-all duration-300'>Upload Existing</p>
        </button>
      </div>

      <hr className='border-slate-700 my-6 sm:w-[305px]' />

      <div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>
        {
          allResumes.map((resume, index) => {
            const baseColor = colors[index%colors.length];
            return (
              <button key={index} onClick={() => navigate(`/app/builder/${resume._id}`)} className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer' style={{background : `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`, borderColor: baseColor + '40'}}>
                <FilePenLineIcon className='size-7 group-hover:scale-105 transition-all' style={{color : baseColor}} />
                <p className='text-sm group-hover:scale-105 transition-all px-2 text-center' style={{color : baseColor}}>{resume.title}</p>
                <p className='absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 text-center px-2' style={{color: baseColor + '90'}}>
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div onClick={e => e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                  <Trash2Icon onClick={() => deleteResume(resume._id)} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />
                  <PencilIcon onClick={() => {setEditResumeId(resume._id); setTitle(resume.title)}} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />
                </div>
              </button>
            )
          })
        }
      </div>

      {
        showCreateResume && (
          <form onSubmit={createResume} onClick={() => setShowCreateResume(false)}  className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6' onClick={e => e.stopPropagation()}>
              <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>
              <input value={title} onChange={(e) => setTitle(e.target.value)} type='text' placeholder='Enter resume title' className='border border-slate-200 w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Create Resume</button>
              <XIcon className='absolute top-4 right-4 hover:text-slate-6 cursor-pointer transition-colors00 text-slate-400' onClick={() => {setShowCreateResume(false); setTitle('')}} />
            </div>
          </form>
        )
      }

      {
        showUploadResume && (
          <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)}  className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6' onClick={e => e.stopPropagation()}>
              <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>
              <input value={title} onChange={(e) => setTitle(e.target.value)} type='text' placeholder='Enter resume title' className='border border-slate-200 w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />

              <div>
                <label htmlFor='resume-upload' className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>
                  Select resume file
                  <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 bo-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-400 cursor-pointer transition-colors '>
                  {
                    resume ? (
                      <p className='text-green-700'>{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloudIcon className='size-14 stroke-1' />
                        <p>Upload Resume</p>
                      </>
                    )
                  }
                </div>
                </label>
                <input id='resume-upload' type='file' accept='.pdf' onChange={(e) => setResume(e.target.files[0])} className='hidden'/>
                
              </div>

              <button disabled={isLoading} className='flex justify-center items-center w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>
                {isLoading && <LoaderCircleIcon className='animate-spin size-4 text-white' />} 
                {isLoading ? 'Uploading...' : 'Upload Resume'}
              </button>
              <XIcon className='absolute top-4 right-4 hover:text-slate-6 cursor-pointer transition-colors00 text-slate-400' onClick={() => {setEditResumeId(false); setTitle('')}} />
            </div>
          </form>
        )
      }

      {
        editResumeId && (
          <form onSubmit={editTitle} onClick={() => setEditResumeId('')}  className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6' onClick={e => e.stopPropagation()}>
              <h2 className='text-xl font-bold mb-4'>Edit Resume title</h2>
              <input value={title} onChange={(e) => setTitle(e.target.value)} type='text' placeholder='Enter resume title' className='border border-slate-200 w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Update</button>
              <XIcon className='absolute top-4 right-4 hover:text-slate-6 cursor-pointer transition-colors00 text-slate-400' onClick={() => {setEditResumeId(''); setTitle('')}} />
            </div>
          </form>
        )
      }
    </div>
  )
}

export default Dashboard
