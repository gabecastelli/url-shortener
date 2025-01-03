const express = require('express');
const connectDB = require('./config/db');
const validURL = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const URL = require('./models/URL');
const app = express();

// Connect to DB
connectDB();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { shortURL: null, error: null });
});

app.get('/404', (req, res) => {
    console.log('test')
    res.render('404');
});

// @route  GET /:code
// @desc   Redirect to long/original URL
app.get('/:code', async (req, res) => {
    try {
        const url = await URL.findOne({ URLCode: req.params.code });

        if (url) {
            return res.redirect(url.longURL);
        } else {
            res.redirect('404');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Server error');
    }
});

// @route   POST /shorten
// @desc    Create short URL
app.post('/shorten', async (req, res) => {
    const longURL = req.body.longURL;
    const baseURL = config.get('baseURL');

    if (!validURL.isUri(baseURL)) {
        return res.status(401).json('Invalid base URL');
    }

    const URLCode = shortid.generate();
    if (validURL.isUri(longURL)) {
        try {
            let url = await URL.findOne({ longURL });
            let shortURL = "";

            if (url) {
                shortURL = url.shortURL;
            } else {
                shortURL = baseURL + '/' + URLCode;

                url = new URL({
                    longURL,
                    shortURL,
                    URLCode,
                    date: new Date()
                });

                await url.save();
            }

            res.render('index', { shortURL: shortURL, error: null });
        } catch (error) {
            console.log(error);
            res.status(500).json('Server error');
        }
    } else {
        res.render('index', { shortURL: null, error: "Invalid URL (use \"http://\" or \"https://\")" });
    }
});

const PORT = 4000; 
app.listen(process.env.PORT || PORT, () => console.log(`Server started on port ${PORT}`));
