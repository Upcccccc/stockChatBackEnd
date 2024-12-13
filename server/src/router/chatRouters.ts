import { Router } from 'express';
import {createChat, getUserChats, getChat, updateChat, deleteChat} from '../controller/chatController';

const router = Router();

router.post('/chats',createChat );
router.get('/userchats', getUserChats);
router.get('/chats/:id', getChat);
router.put('/chats/:id', updateChat);
router.delete('/chats/:id', deleteChat);

export default router;
