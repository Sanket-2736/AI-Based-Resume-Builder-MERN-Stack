import { Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux'
import api from '../congifs/api';

const ProfessionalSummaryForm = ({data, onChange}) => {
    const {token, user} = useSelector(state=>state.auth);
    const [generating, setGenerating] = useState(false);

    const generateSummary = async () => {
    try {
        console.log("⚡ Generate Summary clicked");
        console.log("📝 Current Summary Input:", data);

        setGenerating(true);

        const prompt = `enhance my professional summary : ${data}`;
        console.log("📤 Prompt being sent to AI:", prompt);

        console.log("🚀 Sending request to AI API...");
        const res = await api.post(
            `/api/ai/enhance-pro-sum`,
            { userContent: prompt },
            { headers: { Authorization: token } }
        );

        console.log("✅ AI API Response:", res.data);

        const enhanced = res.data.enhancedContent;

        if (!enhanced) {
            console.error("❌ AI returned empty summary");
            toast.error("AI failed to generate summary");
            return;
        }

        console.log("✨ Enhanced Summary:", enhanced);

        // ✅ Update parent via onChange
        onChange(enhanced);

        console.log("📌 Summary updated in parent state");

    } catch (error) {
        console.error("❌ Error generating summary:", error);
        toast.error('Internal server error');
    } finally {
        setGenerating(false);
        console.log("🔁 Summary generation finished");
    }
};



  return (
    <div className='space-y-4'>
        <div className='items-center flex justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold'>Professional Summary</h3>
                <p className='text-sm text-gray-500'>Add summary for your resume here.</p>
            </div>

            <button disabled={generating} onClick={generateSummary} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'>
                {generating ? (<Loader2 className='size-4 animate-spin' />) : (<Sparkles className='size-4' />)}
                {generating ? 'Enhancing..' : 'AI Enhance'}
            </button>
        </div>

        <div className='mt-6'>
            <textarea name='' id='' className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none' placeholder='Write a compelling professional summary that highlights your key strengths and career objectives.' rows={7} value={data || ''} onChange={(e) => onChange(e.target.value)}/>
            <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>Tip: Keep it concise (3-4 sentences) and focus on most relevant achievements and skills.</p>
        </div>
    </div>
  )
}

export default ProfessionalSummaryForm