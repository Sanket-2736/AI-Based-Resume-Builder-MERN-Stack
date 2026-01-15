import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

export const enhaceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        console.log("🤖 Enhance Professional Summary Request");
        console.log("User Content:", userContent);

        if (!userContent) {
            console.log("⚠ No content provided");
            return res.json({ success: false, message: 'No content found to enhance!' });
        }

        const ai_response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences and highlight key skills, experience, and career objectives. Make it compelling and ATS-friendly. Only return text."
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        });

        const enhancedContent = ai_response.choices[0].message.content;
        console.log("✅ Summary Enhanced Successfully");

        return res.json({ success: true, message: 'Summary enhanced!', enhancedContent });

    } catch (error) {
        console.error("❌ Error Enhancing Summary:", error);
        return res.json({ success: false, message: 'Internal server error!' });
    }
};

export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        console.log("🤖 Enhance Job Description Request");
        console.log("User Content:", userContent);

        if (!userContent) {
            console.log("⚠ No content provided");
            return res.json({ success: false, message: 'No content found to enhance!' });
        }

        const ai_response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enhance the job description. The description should be 1-2 sentences, highlight responsibilities and achievements, use action verbs and quantifiable results, and be ATS-friendly. Only return text."
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        });

        const enhancedContent = ai_response.choices[0].message.content;

        console.log("✅ Job Description Enhanced Successfully");

        return res.json({ success: true, message: 'Description enhanced!', enhancedContent });

    } catch (error) {
        console.error("❌ Error Enhancing Job Description:", error);
        return res.json({ success: false, message: 'Internal server error!' });
    }
};

export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        console.log("📄 Upload Resume via AI");
        console.log("User ID:", userId);
        console.log("Title:", title);

        if (!resumeText) {
            console.log("⚠ Resume text missing");
            return res.json({ success: false, message: 'Missing fields required!' });
        }

        const systemPrompt = "You are an expert AI agent that extracts structured data from resumes.";

        const userPrompt = `
Extract data from this resume text:

${resumeText}

Return ONLY valid JSON in the following format:

{
  "professional_summary": "",
  "skills": [],
  "public": false,
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}
`;

        console.log("🤖 Sending resume to AI for extraction...");

        const ai_response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" }   // FIXED TYPO
        });

        const extractedData = ai_response.choices[0].message.content;

        console.log("📦 Raw AI JSON Response:", extractedData);

        const parsedData = JSON.parse(extractedData);

        const newResume = await Resume.create({ userId, title, ...parsedData });

        console.log("✅ Resume Extracted & Saved:", newResume._id);

        return res.json({
            success: true,
            message: 'Resume uploaded & parsed successfully!',
            resumeId: newResume._id
        });

    } catch (error) {
        console.error("❌ Error Uploading Resume:", error);
        return res.json({ success: false, message: 'Internal server error!' });
    }
};
