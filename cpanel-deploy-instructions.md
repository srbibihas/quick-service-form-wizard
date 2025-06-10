
# cPanel Deployment Instructions

This project has been configured to work seamlessly with cPanel hosting. Follow these steps to deploy:

## Prerequisites
- Node.js installed on your local machine
- Access to your cPanel hosting account
- File Manager or FTP access

## Deployment Steps

### 1. Build the Project Locally
```bash
# Install dependencies
npm install

# Build the project for production
npm run build

# Generate .htaccess file for cPanel
node build-for-cpanel.js
```

### 2. Upload to cPanel
1. **Access your cPanel File Manager** or use FTP
2. **Navigate to `public_html`** directory (or your domain's root folder)
3. **Upload all contents** from the `dist` folder to `public_html`
   - Make sure to include the `.htaccess` file
   - Upload all assets, CSS, and JS files
   - Upload the `index.html` file

### 3. Verify Deployment
- Visit your domain to check if the site loads
- Test navigation between different pages
- Ensure all assets (images, CSS, JS) are loading correctly

## Important Notes

### .htaccess File
The `.htaccess` file is crucial for:
- **React Router support** - Ensures all routes work properly
- **Asset caching** - Improves site performance
- **Gzip compression** - Reduces file sizes

### File Structure After Upload
Your `public_html` should contain:
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

### Troubleshooting

**Routes not working (404 errors)?**
- Ensure `.htaccess` file is uploaded and contains the rewrite rules
- Check if your hosting provider supports `.htaccess` files

**Assets not loading?**
- Verify all files from `dist/assets/` are uploaded to `public_html/assets/`
- Check file permissions (should be 644 for files, 755 for folders)

**Site not loading at all?**
- Ensure `index.html` is in the root of `public_html`
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
