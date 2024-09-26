import express from 'express'
import { deleteUser, editUser, getAllUsers, loginUser, registerUser, verifyToken } from '../controlller/user.controller.js'



const userRouter = express.Router()


userRouter.post('/register',registerUser)
userRouter.post('/login', loginUser);
userRouter.get('/users', getAllUsers);
userRouter.post('/verifyToken', verifyToken);
userRouter.put('/users', verifyToken, editUser); 
userRouter.delete('/users', verifyToken, deleteUser);




export default userRouter 