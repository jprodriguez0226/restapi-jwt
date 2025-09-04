import express, {Application} from 'express';
import morgan from 'morgan';   

const app: Application = express();

import authRoutes from './routes/auth';

//start settings
app.set('port', 4000);

//middlewares
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use(authRoutes);

export default app;