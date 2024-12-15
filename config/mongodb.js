import mongoose from "mongoose";

const connecDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB connected");
  });
  await mongoose.connect(`${process.env.MONGODB_URL}`);
};

export default connecDB;
