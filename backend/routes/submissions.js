const express = require('express');
const router = express.Router();
const multer = require('multer');
const submissionService = require('../services/submissions');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // File name format
  }
});

const upload = multer({ storage: storage });

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
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
