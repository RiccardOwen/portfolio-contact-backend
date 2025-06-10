require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'https://riccardowen.github.io'
}));
app.use(express.json());

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Configure transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Portfolio Contact Form: ${name}`,
            text: `From: ${name} <${email}>\n\n${message}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Message sent!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

app.get('/', (req, res) => {
    res.send('Portfolio Contact Backend is running.');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});