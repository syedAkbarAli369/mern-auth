

import express from "express";
import cors from 'cors'
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js'

import authRouter from "./routes/authRoutes.js";

import dns from 'dns';
import userRouter from "./routes/userRoutes.js";

dns.setServers(["1.1.1.1", "8.8.8.8"])

const app = express();
const port = process.env.PORT || 4000;
connectDB();

console.log("🔥 AUTH ROUTES FILE LOADED");

const allowedOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get('/', (req, res) => res.send("API working fine"))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, () => console.log(`Server started on PORT: ${port}`))




