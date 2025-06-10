
# cPanel Deployment Instructions

This project has been configured to work seamlessly with cPanel hosting. Follow these steps to deploy:

## Prerequisites
- Node.js installed on your local machine
- Access to your cPanel hosting account
- File Manager or FTP access

## Deployment Steps

### 1. Build the Project Locally

#### For Root Domain Deployment (yourdomain.com)
```bash
# Install dependencies
npm install

# Build the project for production
npm run build

# Generate .htaccess file for root deployment
node build-for-cpanel.js
```

#### For Subdirectory Deployment (yourdomain.com/subdirectory)
```bash
# Install dependencies
npm install

# Set the base path for subdirectory
set VITE_BASE_PATH=/book
npm run build

# Generate .htaccess file for subdirectory deployment
node build-for-cpanel.js book
```

### 2. Upload to cPanel

#### For Root Domain:
1. **Access your cPanel File Manager** or use FTP
2. **Navigate to `public_html`** directory
3. **Upload all contents** from the `dist` folder to `public_html`

#### For Subdirectory (like /book):
1. **Access your cPanel File Manager** or use FTP
2. **Navigate to `public_html`** directory
3. **Create a folder** named `book` (or your chosen subdirectory name)
4. **Upload all contents** from the `dist` folder to `public_html/book`

### 3. Verify Deployment
- **Root domain**: Visit yourdomain.com
- **Subdirectory**: Visit yourdomain.com/book
- Test navigation between different pages
- Ensure all assets (images, CSS, JS) are loading correctly

## Important Notes

### For Subdirectory Deployments
- Always set `VITE_BASE_PATH` environment variable before building
- Use the subdirectory name when running the build script
- The .htaccess file will be automatically configured for your subdirectory

### .htaccess File
The `.htaccess` file is crucial for:
- **React Router support** - Ensures all routes work properly
- **Asset caching** - Improves site performance
- **Gzip compression** - Reduces file sizes
- **Subdirectory routing** - Handles paths correctly

### File Structure Examples

#### Root Domain (`public_html/`):
```
public_html/
├── .htaccess
├── index.html
├── assets/
│   ├── css files
│   ├── js files
│   └── images
└── other static files
```

#### Subdirectory (`public_html/book/`):
```
public_html/
└── book/
    ├── .htaccess
    ├── index.html
    ├── assets/
    │   ├── css files
    │   ├── js files
    │   └── images
    └── other static files
```

### Troubleshooting

**Routes not working (404 errors) in subdirectory?**
- Ensure you built with the correct `VITE_BASE_PATH`
- Verify `.htaccess` file is uploaded and contains the correct subdirectory paths
- Check if your hosting provider supports `.htaccess` files

**Assets not loading in subdirectory?**
- Make sure you set `VITE_BASE_PATH=/your-subdirectory` before building
- Verify all files from `dist/assets/` are uploaded to `public_html/your-subdirectory/assets/`

**Site not loading at all?**
- Ensure `index.html` is in the correct directory
- Check cPanel error logs for any server-side issues

### Performance Tips
- Enable Gzip compression (included in .htaccess)
- Use CDN if available through your hosting provider
- Enable browser caching (included in .htaccess)

## Support
If you encounter issues during deployment, check:
1. cPanel error logs
2. Browser developer console for errors
3. Ensure all required files are uploaded correctly
4. Verify the correct base path configuration
