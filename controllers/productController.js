import { v2 as cloudinaty } from "cloudinary";
import productModel from "../models/productModel.js";
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files?.image1?.[0];
    const image2 = req.files.image2 && req.files?.image2?.[0];
    const image3 = req.files.image3 && req.files?.image3?.[0];
    const image4 = req.files.image4 && req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinaty.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      bestseller: bestseller === true ? true : false,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      price: Number(price),
      image: imagesUrl,
      date: Date.now(),
    };
    console.log(productData);

    const product = new productModel(productData);
    await product.save();
    return res
      .status(201)
      .json({ success: true, product, message: "thêm sản phẩm thành công" });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ success: false, message: error.message });
  }
};

///
const listProduct = async (req, res) => {
  try {
    const listProduct = await productModel.find({});
    return res
      .status(200)
      .json({ success: true, listProduct, message: "thành công" });
  } catch (error) {
    return res.status(501).json({ error: error.message });
  }
};

///
const removeProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const productRemove = await productModel.findByIdAndDelete(productId);
    if (!productRemove) {
      return res.status(404).json({
        success: false,

        message: "xóa sản phẩm thất bại",
      });
    }
    return res.status(200).json({
      success: true,
      productRemove,
      message: "xóa sản phẩm Thành Công",
    });
  } catch (error) {
    return res.status(501).json({ error: error.message });
  }
};

///
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ success: true, product, message: "success" });
  } catch (error) {
    return res.status(501).json({ success: false, error: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
