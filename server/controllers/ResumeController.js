import imagekit from '../configs/imagekit.js';
import fs from 'fs';
import Resume from '../models/Resume.js';

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({ userId, title });

    return res.json({
      success: true,
      message: 'Resume created!',
      resume: newResume
    });
  } catch (error) {
    console.error("❌ Create Resume Error:", error);
    return res.json({ success: false, message: 'Internal server error!' });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.json({ success: false, message: "Resume not found!" });
    }

    if (resume.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized!" });
    }

    await Resume.deleteOne({ _id: resumeId });

    return res.json({ success: true, message: 'Resume deleted!' });
  } catch (error) {
    console.error("❌ Delete Resume Error:", error);
    return res.json({ success: false, message: 'Internal server error!' });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.json({ success: false, message: 'Resume not found!' });
    }

    return res.json({ success: true, resume });
  } catch (error) {
    console.error("❌ Fetch Resume Error:", error);
    return res.json({ success: false, message: 'Internal server error!' });
  }
};

export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, public: true });

    if (!resume) {
      return res.json({ success: false, message: 'Resume not found!' });
    }

    return res.json({ success: true, resume, message: 'Resume fetched successfully!' });
  } catch (error) {
    console.error("❌ Public Resume Error:", error);
    return res.json({ success: false, message: 'Internal server error!' });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { resumeId, removeBackground } = req.body;
    const userId = req.userId;
    const image = req.file;

    // IMPORTANT: resumeData is STRING because FormData
    const resumeData = JSON.parse(req.body.resumeData);

    let resumeDataCopy = resumeData;

    if (image) {
      const imageBufferedData = fs.createReadStream(image.path);

      const response = await imagekit.files.upload({
        file: imageBufferedData,
        fileName: 'resume.jpg',
        folder: 'user-resumes',
        transformation: {
          pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremoved' : '')
        }
      });

      resumeDataCopy.personal_info.image = response.url;
    }

    const resume = await Resume.findOneAndUpdate(
        { _id: resumeId, userId },
        { $set: resumeDataCopy }, 
        { new: true }
    );

    if (!resume) {
      return res.json({ success: false, message: "Unauthorized or not found" });
    }

    return res.json({
      success: true,
      message: "Resume updated!",
      resume
    });

  } catch (error) {
    console.error("❌ Update Resume Error:", error);
    return res.json({ success: false, message: "Internal server error!" });
  }
};
