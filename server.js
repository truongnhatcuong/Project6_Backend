import express from "express";
import cors from "cors";
import "dotenv/config";
import connecDB from "./config/mongodb.js";
import connecCloudinary from "./config/cloudinaty.js";
import userRoute from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

const app = express();
const port = process.env.PORT || 6000;
connecDB();
connecCloudinary();
//middleware
app.use(express.json());
app.use(cors());

//api endpointes
app.use("/api/user", userRoute);
app.use("/api/product", productRouter);

app.get("/", (req, res) => {
  res.send("API RUNNING");
});

app.listen(port, () => {
  console.log("server started run :" + port);
});
