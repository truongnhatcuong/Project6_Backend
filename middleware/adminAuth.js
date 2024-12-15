import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ messageL: "không có token" });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ messageL: "Nhập sai mật khẩu" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default adminAuth;
