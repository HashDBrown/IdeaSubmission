import express from 'express';
import multer from 'multer';
import * as submissionService from '../services/submissions.js';
import verifyJWT from '../middleware/auth.js';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // File name format
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only .jpeg and .png files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg and .png files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
});

// Create submission with file upload
router.post('/submit', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File upload failed' });
    }

    const submissionData = {
      email: req.body.email,
      text: req.body.text,
      file: req.file // Include file in the submission data
    };

    const submission = await submissionService.createSubmission(submissionData);

    res.status(201).json({
      message: 'Submission created',
      id: submission.id,
      email: submission.email,
      text: submission.text,
      file_path: submission.file_path
    });

    // Uncomment and modify this if you want to send an email with the attachment
    // await sendEmail(submission.text, submission.email, req.file.path);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

if (process.env.JWT_ENABLED === "true")
  router.use(verifyJWT);

// Get all submissions
router.get('', async (req, res) => {
  try {
    const submissions = await submissionService.getAllSubmissions();
    res.json(submissions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
