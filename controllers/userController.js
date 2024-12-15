import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
// route for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.json({ success: false, message: "tài khoản không tồn tại" });
    }
    const comparePassword = await bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return res.json({
        success: false,
        message: "mật khẩu không đúng ",
      });
    }

    if (comparePassword) {
      const token = createToken(user._id);
      return res.status(201).json({
        success: true,
        token,
        message: "Đăng nhập thành công",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// route for user register
const registerUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const exist = await userModel.findOne({
      email,
    });
    if (exist) {
      return res.json({
        success: false,
        message: "Tài khoản đã tồn tại",
      });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Email không hợp lệ",
      });
    }
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Mật khẩu phải có ít nhất 8 ký tự",
      });
    }

    // hashing password
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);
    return res.status(201).json({
      success: true,
      token,
      message: "Đăng ký thành công",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

//route for admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Kiểm tra email và mật khẩu
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Nếu đúng, tạo token và trả về kết quả
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res
        .status(200)
        .json({ success: true, token, message: "Login successful" });
    } else {
      // Nếu sai mật khẩu hoặc email
      return res
        .status(401) // Trạng thái lỗi 401 - Unauthorized
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    // Xử lý lỗi nếu có
    return res.status(500).json({ success: false, error: error.message });
  }
};

export { loginUser, registerUser, loginAdmin };
