const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

// Serve static files with proper MIME types
app.use(express.static('.', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.svg')) {
            res.setHeader('Content-Type', 'image/svg+xml');
        }
    }
}));

// Route for the main page
app.get('/', (req, res) => {
    const mainFile = path.join(__dirname, 'gosuslugi-wrapper-burger-working-linked.html');
    
    if (fs.existsSync(mainFile)) {
        res.sendFile(mainFile);
    } else {
        // Fallback to output.html if main file doesn't exist
        const fallbackFile = path.join(__dirname, 'output.html');
        if (fs.existsSync(fallbackFile)) {
            res.sendFile(fallbackFile);
        } else {
            res.status(404).send('HTML file not found');
        }
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Website server started successfully!`);
    console.log(`🔗 Local access: http://localhost:${PORT}`);
    console.log('');
    console.log('📄 Available pages:');
    console.log(`   • Main site: http://localhost:${PORT}/`);
    console.log(`   • Output 1: http://localhost:${PORT}/output.html`);
    console.log(`   • Output 2: http://localhost:${PORT}/output2.html`);
    console.log(`   • Burger version: http://localhost:${PORT}/gosuslugi-wrapper-burger-working-linked.html`);
    console.log('');
    console.log('📁 Assets folder: Портал государственных услуг Российской Федерации_files/');
    console.log('');
    console.log('✨ Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server stopped gracefully');
    process.exit(0);
});