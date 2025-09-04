import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    
})
    .then(() => console.log('Base de datos conectada'))
    .catch(err => console.error(err));