import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, Trash2Icon, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../congifs/api';
import toast from 'react-hot-toast';
import pdfToText from 'react-pdftotext'

const COLORS = ['#9333ea', '#d97706', '#dc2626', '#0284c7', '#16a34a'];

const Modal = ({ title, onClose, onSubmit, children }) => (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
      onClick={e => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold text-slate-800 mb-5">{title}</h2>
      <form onSubmit={onSubmit}>
        {children}
      </form>
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <XIcon className="size-5" />
      </button>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState('');
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes');
      setAllResumes(data.resumes || []);
    } catch (error) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/resumes/create', { title });
      setAllResumes(prev => [...prev, data.resume]);
      setTitle('');
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch {
      toast.error('Failed to create resume');
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText });
      if (!data.success) { toast.error(data.message); return; }
      setTitle('');
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch {
      toast.error('Failed to parse resume');
    } finally {
      setIsUploading(false);
    }
  };

  const editTitle = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append('resumeId', editResumeId);
      formdata.append('resumeData', JSON.stringify({ title }));
      const { data } = await api.put('/api/resumes/update', formdata);
      setAllResumes(prev => prev.map(r => r._id === editResumeId ? { ...r, title } : r));
      setTitle('');
      setEditResumeId('');
      toast.success('Title updated');
    } catch {
      toast.error('Failed to update title');
    }
  };

  const deleteResume = async (resumeId) => {
    if (!window.confirm('Delete this resume? This cannot be undone.')) return;
    setAllResumes(prev => prev.filter(r => r._id !== resumeId));
    try {
      await api.delete(`/api/resumes/delete/${resumeId}`);
      toast.success('Resume deleted');
    } catch {
      toast.error('Failed to delete resume');
      loadAllResumes();
    }
  };

  const closeCreate = () => { setShowCreateResume(false); setTitle(''); };
  const closeUpload = () => { setShowUploadResume(false); setTitle(''); setResume(null); };
  const closeEdit = () => { setEditResumeId(''); setTitle(''); };

  useEffect(() => { loadAllResumes(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">
          Welcome back, <span className="text-green-600">{user?.name?.split(' ')[0] || 'there'}</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your resumes or create a new one.</p>
      </div>

      {/* Action cards */}
      <div className="flex gap-4 flex-wrap mb-6">
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-36 h-48 flex flex-col items-center justify-center rounded-xl gap-2.5 text-slate-600 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200 bg-white group cursor-pointer"
        >
          <div className="size-11 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 group-hover:scale-105 transition-transform">
            <PlusIcon className="size-5 text-white" />
          </div>
          <p className="text-sm font-medium group-hover:text-indigo-600 transition-colors">New Resume</p>
        </button>

        <button
          onClick={() => setShowUploadResume(true)}
          className="w-36 h-48 flex flex-col items-center justify-center rounded-xl gap-2.5 text-slate-600 border-2 border-dashed border-slate-200 hover:border-purple-400 hover:shadow-md transition-all duration-200 bg-white group cursor-pointer"
        >
          <div className="size-11 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 group-hover:scale-105 transition-transform">
            <UploadCloudIcon className="size-5 text-white" />
          </div>
          <p className="text-sm font-medium group-hover:text-purple-600 transition-colors">Import PDF</p>
        </button>
      </div>

      {/* Divider */}
      {allResumes.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs text-slate-400 uppercase tracking-wider">Your Resumes</span>
          <hr className="flex-1 border-slate-200" />
        </div>
      )}

      {/* Resume grid */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 py-10">
          <LoaderCircleIcon className="animate-spin size-5" />
          <span className="text-sm">Loading resumes...</span>
        </div>
      ) : allResumes.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FilePenLineIcon className="size-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No resumes yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const color = COLORS[index % COLORS.length];
            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative w-36 h-48 flex flex-col items-center justify-center rounded-xl gap-2 border group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${color}10, ${color}30)`, borderColor: color + '50' }}
              >
                <FilePenLineIcon className="size-7 group-hover:scale-105 transition-transform" style={{ color }} />
                <p className="text-sm font-medium px-3 text-center leading-tight line-clamp-2" style={{ color }}>
                  {resume.title}
                </p>
                <p className="absolute bottom-2 text-[10px] text-center px-2" style={{ color: color + '99' }}>
                  {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>

                {/* Hover actions */}
                <div
                  onClick={e => e.stopPropagation()}
                  className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center gap-0.5"
                >
                  <button
                    onClick={() => { setEditResumeId(resume._id); setTitle(resume.title); }}
                    className="p-1.5 hover:bg-white/60 rounded-md transition-colors"
                    title="Rename"
                  >
                    <PencilIcon className="size-3.5 text-slate-600" />
                  </button>
                  <button
                    onClick={() => deleteResume(resume._id)}
                    className="p-1.5 hover:bg-white/60 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2Icon className="size-3.5 text-slate-600" />
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      {showCreateResume && (
        <Modal title="Create a new resume" onClose={closeCreate} onSubmit={createResume}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            type="text"
            placeholder="e.g. Software Engineer Resume"
            className="border border-slate-200 w-full px-4 py-2.5 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoFocus
          />
          <button className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
            Create Resume
          </button>
        </Modal>
      )}

      {/* Upload modal */}
      {showUploadResume && (
        <Modal title="Import from PDF" onClose={closeUpload} onSubmit={uploadResume}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            type="text"
            placeholder="Resume title"
            className="border border-slate-200 w-full px-4 py-2.5 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <label
            htmlFor="resume-upload"
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-green-400 rounded-lg p-6 mb-4 cursor-pointer transition-colors"
          >
            {resume ? (
              <p className="text-sm text-green-700 font-medium">{resume.name}</p>
            ) : (
              <>
                <UploadCloudIcon className="size-10 text-slate-300" />
                <p className="text-sm text-slate-500">Click to select a PDF</p>
              </>
            )}
          </label>
          <input id="resume-upload" type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])} className="hidden" required />
          <button
            disabled={isUploading}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isUploading && <LoaderCircleIcon className="animate-spin size-4" />}
            {isUploading ? 'Parsing with AI...' : 'Import Resume'}
          </button>
        </Modal>
      )}

      {/* Edit title modal */}
      {editResumeId && (
        <Modal title="Rename resume" onClose={closeEdit} onSubmit={editTitle}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            type="text"
            placeholder="New title"
            className="border border-slate-200 w-full px-4 py-2.5 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoFocus
          />
          <button className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
            Save
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
