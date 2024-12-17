import userModel from "../models/userModel.js";

// add cart
const addtocart = async (req, res) => {
  const { userId, itemId, size } = req.body;

  const userData = await userModel.findById(userId);
  if (!userData) {
    return res.json({ success: false, message: "User not found" });
  }
  let cartData = userData.cartData;
  if (!cartData) {
    res.json({ success: false, message: "lỗi cart" });
  }
  try {
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "add to cart success" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//update cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "update cart success" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get user Cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addtocart, updateCart, getUserCart };
