const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// MongoDB Atlas connection
const MONGODB_URI = 'mongodb+srv://aryanraisingh2006_db_user:QeXzPDtjylI9xZZJ@cluster0.f2viyqs.mongodb.net/health_surveillance';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'ASHA Worker' },
  createdAt: { type: Date, default: Date.now }
});

const caseSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  symptoms: [String],
  waterSource: { type: String, required: true },
  location: { type: String, required: true },
  notes: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const waterTestSchema = new mongoose.Schema({
  location: { type: String, required: true },
  turbidity: { type: Number, required: true },
  ph: { type: Number, required: true },
  temperature: Number,
  bacterialTest: String,
  notes: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  location: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Case = mongoose.model('Case', caseSchema);
const WaterTest = mongoose.model('WaterTest', waterTestSchema);
const Alert = mongoose.model('Alert', alertSchema);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In a real app, send reset email here
    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// Case Routes
app.post('/api/cases', authenticateToken, async (req, res) => {
  try {
    const { patientName, age, gender, symptoms, waterSource, location, notes } = req.body;

    const newCase = new Case({
      patientName,
      age,
      gender,
      symptoms,
      waterSource,
      location,
      notes,
      reportedBy: req.user.userId
    });

    await newCase.save();

    res.status(201).json({
      message: 'Case report submitted successfully',
      case: newCase
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while submitting case' });
  }
});

app.get('/api/cases', authenticateToken, async (req, res) => {
  try {
    const cases = await Case.find().populate('reportedBy', 'name email').sort({ createdAt: -1 });
    res.json({ cases });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching cases' });
  }
});

// Water Test Routes
app.post('/api/water-tests', authenticateToken, async (req, res) => {
  try {
    const { location, turbidity, ph, temperature, bacterialTest, notes } = req.body;

    const newWaterTest = new WaterTest({
      location,
      turbidity,
      ph,
      temperature,
      bacterialTest,
      notes,
      reportedBy: req.user.userId
    });

    await newWaterTest.save();

    res.status(201).json({
      message: 'Water test report submitted successfully',
      waterTest: newWaterTest
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while submitting water test' });
  }
});

app.get('/api/water-tests', authenticateToken, async (req, res) => {
  try {
    const waterTests = await WaterTest.find().populate('reportedBy', 'name email').sort({ createdAt: -1 });
    res.json({ waterTests });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching water tests' });
  }
});

// Alert Routes
app.get('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const alerts = await Alert.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching alerts' });
  }
});

app.post('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const { title, message, severity, location } = req.body;

    const newAlert = new Alert({
      title,
      message,
      severity,
      location
    });

    await newAlert.save();

    res.status(201).json({
      message: 'Alert created successfully',
      alert: newAlert
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while creating alert' });
  }
});

// Image Upload Route
app.post('/api/upload-image', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during file upload' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Health Surveillance API is running' });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    
    // Create some sample alerts
    Alert.countDocuments().then(count => {
      if (count === 0) {
        const sampleAlerts = [
          {
            title: 'Water Quality Alert',
            message: 'High bacterial contamination detected in Ward 5 handpumps',
            severity: 'high',
            location: 'Ward 5, Village Center'
          },
          {
            title: 'Diarrhea Outbreak',
            message: 'Multiple cases reported in surrounding areas',
            severity: 'critical',
            location: 'Northern Districts'
          },
          {
            title: 'Preventive Measures',
            message: 'Boil water before consumption as precautionary measure',
            severity: 'medium',
            location: 'All Areas'
          }
        ];

        Alert.insertMany(sampleAlerts).then(() => {
          console.log('Sample alerts created');
        });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

module.exports = app;