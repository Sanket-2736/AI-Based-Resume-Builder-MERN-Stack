import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets';
import ResumePreview from '../components/ResumePreview';
import { ArrowLeftIcon, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../congifs/api';

const Preview = () => {
  const {resumeId} = useParams();

  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadResume = async() => {
    try {
      const {data} = await api.get(`api/resumes/public/${resumeId}`);
      setResumeData(data.resume);
      toast.success(data.message)
    } catch (error) {
      console.log(error);
      toast.error("Internal server error!");
    }
  }

  useEffect(()=>{
    loadResume();
  }, []);


  return resumeData ? (
    <div className='bg-slate-100'>
      <div className='max-w-3xl mx-auto py-10'>
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes='py-4 bg-white' />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? <Loader /> : (
        <div>
          <p className='text-center text-6xl text-slate-400'>Resume not found!</p>
          <a className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center justify-center transition-colors' href='/'>
            <ArrowLeftIcon className='mr-2 size-4' /> Go to home page
          </a>
        </div>
      )}
    </div>
  )
}

export default Preview
