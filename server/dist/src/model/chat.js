"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    history: [
        {
            role: {
                type: String,
                enum: ["user", "model"],
                required: true,
            },
            parts: [
                {
                    text: {
                        type: String,
                        required: true,
                    },
                },
            ],
            img: {
                type: String,
                required: false,
            },
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.models.chat || mongoose_1.default.model("chat", chatSchema);
