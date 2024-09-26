import express from 'express'
import { getAllUsers, loginUser, registerUser, verifyToken } from '../controlller/user.controller.js'



const userRouter = express.Router()


userRouter.post('/register',registerUser)
userRouter.post('/login', loginUser);
userRouter.get('/users', getAllUsers);
userRouter.post('/verifyToken', verifyToken);




export default userRouter 