import dotenv from 'dotenv';
dotenv.config();

import app from './app';

import './database';
import authRoutes from './routes/auth';

app.use('/auth', authRoutes);

function main() {
    app.listen(app.get('port'));
    console.log('Servidor corriendo en el puerto', app.get('port'));

}

main();

