import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';  // 添加这行
import apiRoutes from './src/router/index';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 添加 CORS 中间件配置，放在其他中间件之前
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(bodyParser.json());
app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
