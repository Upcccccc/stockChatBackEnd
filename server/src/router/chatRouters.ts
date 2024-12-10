import { Router } from 'express';
import {createChat, getUserChats, getChat, updateChat } from '../controller/chatController';

const router = Router();

router.post('/chats',createChat );
router.get('/userchats', getUserChats);
router.get('/chats/:id', getChat);
router.put('/chats/:id', updateChat);

export default router;
