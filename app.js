// Imports.
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');

// Default port for dev, or use the hosting server port.
const PORT = process.env.PORT || 5000;

// Initializations.
const app = express();
const worker = createWorker({
    // logger: m => console.log(m.progress),
});

// Initialize storage using Multer.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // This callback gets called whenever a file is uploaded.
        cb(null, './uploads');
    }, filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Handle the upload of a single file and name it: "textImage".
const upload = multer({storage: storage}).single('textImage');

// Set the view engine of the app to be "ejs".
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Routes.
app.get('/', (req, res) => {
    res.render('index');
});
app.post('/upload', (req, res) => {
    upload(req, res, err => {
        if(err) {
            return console.log('1-This is an error', err);
        }
        // Read the uploaded image.
        fs.readFile(`./uploads/${req.file.originalname}`, (err, img) => {
            if (err) {
                return console.log('2-This is an error', err);
            }
            (async () => {
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(img);
                const { data } = await worker.getPDF('Tesseract OCR Result');
                //Write read data to a PDF file.
                fs.writeFileSync('results.pdf', Buffer.from(data));
                // Delete original image.
                fs.unlinkSync(`./uploads/${req.file.originalname}`);
                // res.send(text);
                await worker.terminate();
                // Redirect to download.
                res.redirect('/download');
              })();
        });
    });
});
app.get('/download', (req, res) => {
    // Get generated PDF results.
    const file = `${__dirname}/results.pdf`;
    // Download the file.
    res.download(file, 'results.pdf', err => {
        if (err) {
            console.log(err);
        }
        // Delete the generated PDF.
        fs.unlinkSync(file);
    });
});

// Start the server.
app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`);
})