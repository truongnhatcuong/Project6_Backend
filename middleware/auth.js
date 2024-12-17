import jwt from "jsonwebtoken";
const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "not authorized login again" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decode.id;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
