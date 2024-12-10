"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userChatsSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    chats: [
        {
            _id: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.models.userchats || mongoose_1.default.model("userchats", userChatsSchema);
