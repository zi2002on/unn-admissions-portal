const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(express.static(__dirname));

app.use(cors());
app.use(express.json());

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('submissions.json')) fs.writeFileSync('submissions.json', '[]');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/submit-form', upload.fields([
  { name: 'passport', maxCount: 1 },
  { name: 'admission_letter', maxCount: 1 },
  { name: 'olevel_result', maxCount: 1 },
  { name: 'birth_certificate', maxCount: 1 },
  { name: 'identification', maxCount: 1 },
  { name: 'school_fees_receipt', maxCount: 1 },
  { name: 'student_personal_information', maxCount: 1 },
  { name: 'acceptance_fee', maxCount: 1 },
  { name: 'jamb_score', maxCount: 1 },
  { name: 'letter_of_undertaking', maxCount: 1 },
  { name: 'screening_result', maxCount: 1 }
]), (req, res) => {
  const data = { ...req.body, files: Object.keys(req.files || {}), submittedAt: new Date() };
  const submissions = JSON.parse(fs.readFileSync('submissions.json'));
  submissions.push(data);
  fs.writeFileSync('submissions.json', JSON.stringify(submissions, null, 2));
  console.log("New submission received!");
  res.json({ success: true, message: "Submitted successfully!" });
});

app.listen(PORT, () => {
  console.log(`Backend RUNNING → http://localhost:${PORT}`);
  console.log(`Files saved in: ${path.resolve('uploads')}`);
});