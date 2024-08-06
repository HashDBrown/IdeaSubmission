const express = require('express');
const router = express.Router();
const submissionService = require('../services/submissions');
const multer = require('multer');



// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save the uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // File name format
    }
});
const upload = multer({ storage: storage });


// Create submission
router.post('/submit', upload.single('file'), async (req, res) => {
    try {
        const submissionData = {
            email: req.body.email,
            text: req.body.text,
            file_path: req.file.path
        };

        const submission = await submissionService.createSubmission(submissionData);
        res.status(201).json({
            message: 'Submission created',
            id: submission.id,
            email: submission.email,
            text: submission.text,
            file_path: submission.file_path,
            file: req.file
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;