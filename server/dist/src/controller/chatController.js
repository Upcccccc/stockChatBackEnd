"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChat = exports.getChat = exports.getUserChats = exports.createChat = void 0;
const chat_1 = __importDefault(require("../model/chat"));
const userChats_1 = __importDefault(require("../model/userChats"));
const queryRAG_1 = require("../utils/queryRAG");
const USER_ID = "testUser";
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { text } = req.body;
    if (!text) {
        res.status(400).send("Text is required");
        return;
    }
    try {
        const newChat = new chat_1.default({
            userId: USER_ID,
            history: [{ role: "user", parts: [{ text }] }],
        });
        const savedChat = yield newChat.save();
        let userChats = yield userChats_1.default.findOne({ userId: USER_ID });
        if (!userChats) {
            userChats = new userChats_1.default({
                userId: USER_ID,
                chats: [
                    {
                        _id: savedChat._id.toString(),
                        title: text.substring(0, 40),
                    },
                ],
            });
        }
        else {
            userChats.chats.push({
                _id: savedChat._id.toString(),
                title: text.substring(0, 40),
            });
        }
        yield userChats.save();
        const response = yield (0, queryRAG_1.queryRAG)(text);
        const answer = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.answer) || "No answer";
        yield chat_1.default.updateOne({ _id: savedChat._id, userId: USER_ID }, {
            $push: {
                history: {
                    role: "model",
                    parts: [{ text: answer }]
                }
            }
        });
        res.status(201).send(savedChat._id.toString());
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error creating chat!");
    }
});
exports.createChat = createChat;
const getUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userChats = yield userChats_1.default.findOne({ userId: USER_ID });
        res.status(200).send((userChats === null || userChats === void 0 ? void 0 : userChats.chats) || []);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error fetching userchats!");
    }
});
exports.getUserChats = getUserChats;
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chat_1.default.findOne({ _id: req.params.id, userId: USER_ID });
        res.status(200).send(chat);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error fetching chat!");
    }
});
exports.getChat = getChat;
const updateChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { question, img } = req.body;
    if (!question) {
        res.status(400).send("Question is required");
        return;
    }
    try {
        yield chat_1.default.updateOne({ _id: req.params.id, userId: USER_ID }, {
            $push: {
                history: Object.assign({ role: "user", parts: [{ text: question }] }, (img && { img }))
            },
        });
        const response = yield (0, queryRAG_1.queryRAG)(question);
        const answer = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.answer) || "No answer";
        yield chat_1.default.updateOne({ _id: req.params.id, userId: USER_ID }, {
            $push: {
                history: {
                    role: "model",
                    parts: [{ text: answer }]
                }
            },
        });
        res.status(200).send("ok");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error adding conversation!");
    }
});
exports.updateChat = updateChat;
