require('./mdl');

const express = require('express');
const app = express();
const port = process.env.port || 8080;


app.all('*', (req, res, next) => {
    console.log("check");
    next();
})

app.use(express.json());

// app.get('/login', (req, res) => res.send('login page'));
// app.post('/contact', (req, res) => res.json({ firstName: 'Yovel' }));
// app.put('/contact', (req, res) => res.send('update contact'));
// app.delete('/contact', (req, res) => res.send('delete contact'));

app.post('/saveMusic', (req, res) => {
    const { songs = [] } = req.body;

    console.log("Songs are: ", songs)
    res.json({ seccuss: 1 })
})


app.get('/playmusic/:music_id', (req, res) => {
    res.send(`
    <!doctype html>
    <html>
        <head>
            <title>${req.params.music_id}</title>
        </head>
        <body></body>
    </html>
    `)
})




app.all('*', (req, res) => res.send('Global handler'));



app.listen(port);
console.log('listening to port', port)