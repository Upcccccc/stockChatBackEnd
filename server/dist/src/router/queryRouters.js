"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiHandler_1 = require("../utils/apiHandler");
const queryController_1 = require("../controller/queryController");
const router = express_1.default.Router();
router.post('/', (0, apiHandler_1.asyncErrorHandler)(queryController_1.handleQuery));
exports.default = router;
