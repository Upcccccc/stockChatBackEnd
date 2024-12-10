import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';  // 添加这行
import apiRoutes from './src/router/index';
import chatRouter from "./src/router/chatRouters";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 添加 CORS 中间件配置，放在其他中间件之前
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// 连接MongoDB
mongoose.connect(process.env.MONGO_URI as string, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

app.use(bodyParser.json());
app.use('/api', apiRoutes);
app.use('/api', chatRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
