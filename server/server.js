const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.use((req, res, next) => {
    res.setTimeout(0); // Ustawienie braku limitu czasu dla odpowiedzi
    next();
});

function runPythonScript(text) {
    return new Promise((resolve, reject) => {
        const python = spawn('python', ['predict.py', text]);

        let dataToSend = '';
        let errorBuffer = '';

        console.log(`Script started with text: ${text}`);

        python.stdout.on('data', (data) => {
            dataToSend += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorBuffer += data.toString();
        });

        python.on('close', (code) => {
            const ignoreErrors = [
                "Could not find cuda drivers",
                "GPU will not be used",
                "TF-TRT Warning: Could not find TensorRT",
                "TensorFlow binary is optimized to use available CPU instructions",
                "performance-critical operations",
                "rebuild TensorFlow with the appropriate compiler flags"
            ];

            // Check and filter specific TensorFlow warnings
            const filteredErrorBuffer = errorBuffer.split('\n').filter(line =>
                !ignoreErrors.some(err => line.includes(err))
            ).join('\n');

            if (filteredErrorBuffer) {
                console.error(`stderr: ${filteredErrorBuffer}`);
            }

            if (code !== 0) {
                return reject(new Error(`Process exited with code ${code}`));
            }
            resolve(dataToSend.trim());
        });
    });
}

app.get('/api', async (req, res) => {
    try {
        const text = req.query.text;
        const isAi = await runPythonScript(text);
        res.json({ isAi });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`HTTP Server running on port ${port}`);
});
