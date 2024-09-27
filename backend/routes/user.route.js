import express from 'express'
import { deleteUser, editUser, getAllUsers, loginUser, registerUser, verifyToken } from '../controlller/user.controller.js'



const userRouter = express.Router()


userRouter.post('/register',registerUser)
userRouter.post('/login', loginUser);
userRouter.get('/getAllUsers', getAllUsers);
userRouter.post('/verifyToken', verifyToken);
userRouter.patch("/users/:userId", editUser);
userRouter.delete('/users/:userId', deleteUser);




export default userRouter 