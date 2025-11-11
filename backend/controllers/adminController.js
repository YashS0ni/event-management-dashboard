import jwt from 'jsonwebtoken';

let ADMIN_EMAIL = 'admin@example.com';
let ADMIN_PASSWORD = 'admin123';
let resetTokens = {};

export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '1d',
  });

  res.status(200).json({ token });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(404).json({ error: 'Admin email not found' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '15m',
  });


  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

export const resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    if (
      decoded.email !== ADMIN_EMAIL ||
      resetTokens[decoded.email] !== token
    ) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password too short (min 6 chars)' });
    }

    ADMIN_PASSWORD = newPassword;
    delete resetTokens[decoded.email];

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};
