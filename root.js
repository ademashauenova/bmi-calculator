const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.get('/history', (req, res) => {
    res.sendFile(__dirname + '/views/history.html');
});

const bmiRoutes = require('./routes/bmiRoutes');
app.use('/bmicalculator', bmiRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});