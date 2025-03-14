"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queryRouters_1 = __importDefault(require("./queryRouters"));
const stockRouters_1 = __importDefault(require("./stockRouters"));
const newsRouters_1 = __importDefault(require("./newsRouters"));
const newsDeclineRouters_1 = __importDefault(require("./newsDeclineRouters"));
const newsDeclineAssetsRouters_1 = __importDefault(require("./newsDeclineAssetsRouters"));
const stockMinMaxCompanyRouters_1 = __importDefault(require("./stockMinMaxCompanyRouters"));
const stockMinMaxPriceRouters_1 = __importDefault(require("./stockMinMaxPriceRouters"));
const router = express_1.default.Router();
router.use('/query', queryRouters_1.default);
router.use('/stock-data', stockRouters_1.default);
router.use('/news-events', newsRouters_1.default);
router.use('/news-decline-company', newsDeclineRouters_1.default);
router.use('/news-decline-assets', newsDeclineAssetsRouters_1.default);
router.use('/stocks-min-max-company', stockMinMaxCompanyRouters_1.default);
router.use('/stocks-min-max-price', stockMinMaxPriceRouters_1.default);
exports.default = router;
