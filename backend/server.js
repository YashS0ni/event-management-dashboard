import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import eventRoutes from './routes/events.js';
import adminRoutes from './routes/admin.js';
import userRouter from './routes/userRoute.js';


// App Config

const app = express();
const port = process.env.PORT || 4000;
connectDB();
//Middlewares

app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/events', eventRoutes);   // event routes 
app.use('/api/admin', adminRoutes);    // Admin login/reset
app.use('/api/user', userRouter);      //  user routes


app.listen(port, () => console.log('server started on port::' + port));