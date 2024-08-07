// middleware/auth.js
import jwt from 'jsonwebtoken';
import { User } from '../Models/User.js';

export const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, "!@#$%^&*()");
    const user = await User.findById(decoded.userId);

    if (!user || user.its_admin !== 0) {
      return res.status(403).json({ message: "Access Denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Access Denied" });
  }
};
