"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // 添加这行
const index_1 = __importDefault(require("./src/router/index"));
const chatRouters_1 = __importDefault(require("./src/router/chatRouters"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// 添加 CORS 中间件配置，放在其他中间件之前
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
// 连接MongoDB
mongoose_1.default.connect(process.env.MONGO_URI, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});
app.use(body_parser_1.default.json());
app.use('/api', index_1.default);
app.use('/api', chatRouters_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
