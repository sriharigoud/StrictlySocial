const express = require('express');
const connectDB = require('./config/db')
const app = express();

connectDB();

app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('API Running'))

// define routes
app.use('/api/users', require('./routes/apis/users'));
app.use('/api/auth', require('./routes/apis/auth'));
app.use('/api/posts', require('./routes/apis/posts'));


const PORT = process.env.PORT || 5000;

app.listen(PORT,  () => console.log("Server is running on port " + PORT))