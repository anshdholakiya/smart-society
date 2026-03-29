const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const sendEmail = require('../utils/sendEmail');
const { cloudinary } = require('../middleware/uploadMiddleware');

const generateToken = (id, name, role) => {
  return jwt.sign({ id, name, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {

    res.json({
      token: generateToken(user.id, user.name, user.role),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture }
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (await User.findOne({ where: { email } })) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword, role, isSetup: true });

  res.status(201).json({ token: generateToken(user.id, user.name, user.role) });
};

exports.inviteUser = async (req, res) => {
  try {
    const { name, email, role, wing, flatNumber } = req.body;

    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name, email, role, wing, flatNumber,
      invitationToken: token,
      password: 'NOT_SET',
      isSetup: false
    });

    const inviteLink = `http://localhost:5173/setup-password/${token}`;

    const message = `
      You have been invited to join the Smart Society Management system.
      Please click on the following link to set your password and activate your account:
      ${inviteLink}

      Role: ${role}
      Wing: ${wing || 'N/A'}
      Flat Number: ${flatNumber || 'N/A'}

      If you did not request this, please ignore this email.
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Invitation to Smart Society Management System',
        message: message,
      });

      console.log(`✅ Email sent to ${user.email}`);
      res.status(201).json({ message: 'Invitation link sent successfully to email.' });
    } catch (err) {
      console.log('❌ Failed to send email.', err);
      
      user.invitationToken = undefined;
      await user.save({ validate: false });

      return res.status(500).json({ message: 'Error sending email. Please try again later.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inviting user' });
  }
};

exports.setupPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    console.log("🛠️ Setup requested for token:", token);

    const user = await User.findOne({ where: { invitationToken: token } });

    if (!user) {
      console.log("❌ Invalid Token");
      return res.status(400).json({ message: 'Invalid or expired invite link.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.invitationToken = null; 
    user.isSetup = true;
    await user.save();

    console.log("✅ Password set for:", user.email);
    res.json({ message: 'Account activated! You can now login.' });
  } catch (error) {
    console.error("Setup Error:", error);
    res.status(500).json({ message: 'Error setting password' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ order: [['wing', 'ASC'], ['flatNumber', 'ASC']] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing user' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      wing: user.wing,
      flatNumber: user.flatNumber,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.file) {
      
      if (user.profilePictureId) {
        try {
          await cloudinary.uploader.destroy(user.profilePictureId);
        } catch (err) {
          console.error("Failed to delete old profile picture:", err);
        }
      }
      
      user.profilePicture = req.file.path; 
      user.profilePictureId = req.file.filename; 
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.wing = req.body.wing || user.wing;
    user.flatNumber = req.body.flatNumber || user.flatNumber;

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      wing: user.wing,
      flatNumber: user.flatNumber,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = req.body.role;
    await user.save();
    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role' });
  }
};