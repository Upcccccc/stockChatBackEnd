"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiHandler_1 = require("../utils/apiHandler");
const stockMinMaxPriceController_1 = require("../controller/stockMinMaxPriceController");
const router = express_1.default.Router();
router.get('/', (0, apiHandler_1.asyncErrorHandler)(stockMinMaxPriceController_1.getMinMaxPriceEvents));
exports.default = router;
