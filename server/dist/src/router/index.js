"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queryRouters_1 = __importDefault(require("./queryRouters"));
const stockRouters_1 = __importDefault(require("./stockRouters"));
const newsRouters_1 = __importDefault(require("./newsRouters"));
const router = express_1.default.Router();
router.use('/query', queryRouters_1.default);
router.use('/stock-data', stockRouters_1.default);
router.use('/news-events', newsRouters_1.default);
exports.default = router;
