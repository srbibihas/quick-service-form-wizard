
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__dirname);

// Get subdirectory from command line argument or default to root
const subdirectory = process.argv[2] || '';
const basePath = subdirectory ? `/${subdirectory}` : '';

// Create .htaccess content for React Router support on cPanel with subdirectory support
const htaccessContent = `RewriteEngine On
RewriteBase ${basePath}/

# Handle Angular and React Routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . ${basePath}/index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>`;

// Function to create .htaccess file in dist folder
function createHtaccess() {
    const distPath = path.join(__dirname, 'dist');
    const htaccessPath = path.join(distPath, '.htaccess');
    
    // Check if dist folder exists
    if (fs.existsSync(distPath)) {
        fs.writeFileSync(htaccessPath, htaccessContent);
        console.log('✅ .htaccess file created successfully in dist folder');
        if (subdirectory) {
            console.log(`📁 Configured for subdirectory: /${subdirectory}`);
            console.log(`🌐 Your app will be accessible at: yourdomain.com/${subdirectory}`);
        } else {
            console.log('🌐 Configured for root domain deployment');
        }
    } else {
        console.log('❌ dist folder not found. Please run "npm run build" first.');
    }
}

// Run the function
createHtaccess();
