import { RequestHandler } from 'express';
import Chat from '../model/chat';
import UserChats from '../model/userChats';
import { queryRAG } from '../utils/queryRAG';

const USER_ID = "testUser";

export const createChat: RequestHandler = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        res.status(400).send("Text is required");
        return;
    }

    try {
        const newChat = new Chat({
            userId: USER_ID,
            history: [{ role: "user", parts: [{ text }] }],
        });
        const savedChat = await newChat.save();

        let userChats = await UserChats.findOne({ userId: USER_ID });
        if (!userChats) {
            userChats = new UserChats({
                userId: USER_ID,
                chats: [
                    {
                        _id: savedChat._id.toString(),
                        title: text.substring(0, 40),
                    },
                ],
            });
        } else {
            userChats.chats.push({
                _id: savedChat._id.toString(),
                title: text.substring(0, 40),
            });
        }
        await userChats.save();

        const response = await queryRAG(text);
        const answer = response.data?.answer || "No answer";

        await Chat.updateOne(
            { _id: savedChat._id, userId: USER_ID },
            {
                $push: {
                    history: {
                        role: "model",
                        parts: [{ text: answer }]
                    }
                }
            }
        );

        res.status(201).send(savedChat._id.toString());
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating chat!");
    }
};

export const getUserChats: RequestHandler = async (req, res) => {
    try {
        const userChats = await UserChats.findOne({ userId: USER_ID });
        res.status(200).send(userChats?.chats || []);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching userchats!");
    }
};

export const getChat: RequestHandler = async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId: USER_ID });
        res.status(200).send(chat);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching chat!");
    }
};

export const updateChat: RequestHandler = async (req, res) => {
    const { question, img } = req.body;
    if (!question) {
        res.status(400).send("Question is required");
        return;
    }

    try {
        await Chat.updateOne(
            { _id: req.params.id, userId: USER_ID },
            {
                $push: {
                    history: {
                        role: "user",
                        parts: [{ text: question }],
                        ...(img && { img })
                    }
                },
            }
        );

        const response = await queryRAG(question);
        const answer = response.data?.answer || "No answer";

        await Chat.updateOne(
            { _id: req.params.id, userId: USER_ID },
            {
                $push: {
                    history: {
                        role: "model",
                        parts: [{ text: answer }]
                    }
                },
            }
        );

        res.status(200).send("ok");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding conversation!");
    }
};
