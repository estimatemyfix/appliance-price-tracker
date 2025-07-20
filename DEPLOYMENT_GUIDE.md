# 🚀 Deployment Guide - Appliance Price Tracker

This guide will walk you through deploying your Appliance Price Tracker to the web for free!

## 📋 Prerequisites

- [ ] GitHub account (free) - https://github.com
- [ ] Vercel account (free) - https://vercel.com  
- [ ] Railway account (free) - https://railway.app

## 🌐 Deployment Strategy

We'll deploy:
- **Frontend (client)** → **Vercel** (free, perfect for Next.js)
- **Backend (server)** → **Railway** (free tier, good for Node.js + PostgreSQL)

---

## 📤 Step 1: Upload to GitHub

### 1.1 Create GitHub Repository
1. Go to https://github.com
2. Click **"New repository"**  
3. Name it: `appliance-price-tracker`
4. Make it **Public** (required for free deployments)
5. Click **"Create repository"**

### 1.2 Upload Your Code
**Option A: Use GitHub Web Interface**
1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop ALL your project folders/files
3. Add commit message: "Initial commit - Appliance Price Tracker"
4. Click **"Commit changes"**

**Option B: Use Git Commands** (if you have Git installed)
```bash
git init
git add .
git commit -m "Initial commit - Appliance Price Tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/appliance-price-tracker.git
git push -u origin main
```

---

## 🎯 Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Click **"Login"** 
3. Sign up with GitHub (easiest option)

### 2.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `appliance-price-tracker` repository
4. Select **"server"** as the root directory

### 2.3 Add Database
1. In your Railway project, click **"+ New"**
2. Select **"PostgreSQL"** 
3. Railway will create a database automatically
4. Note the connection details (we'll use them next)

### 2.4 Configure Environment Variables
1. Click on your **server service**
2. Go to **"Variables"** tab
3. Add these environment variables:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Optional - add these for full functionality
SENDGRID_API_KEY=your-sendgrid-key-when-ready
OPENAI_API_KEY=your-openai-key-when-ready
```

### 2.5 Deploy Backend
1. Railway will automatically deploy your backend
2. Wait for deployment to complete (2-3 minutes)
3. Your backend will be live at: `https://your-app-name.railway.app`
4. **Copy this URL** - you'll need it for frontend deployment

### 2.6 Initialize Database
1. Go to Railway **"PostgreSQL"** service
2. Click **"Connect"** 
3. Use the **"psql"** option in browser
4. Run these commands:

```sql
-- Copy and paste the contents of database/schema.sql
-- Copy and paste the contents of database/seed.sql  
```

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account  
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with GitHub (easiest option)

### 3.2 Import Project
1. Click **"New Project"**
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` 
   - **Output Directory**: `.next`

### 3.3 Add Environment Variables
1. In **"Environment Variables"** section, add:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_SITE_URL=https://your-frontend-url.vercel.app
```

Replace `your-backend-url` with your Railway URL from Step 2.5

### 3.4 Deploy Frontend
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Your website will be live at: `https://your-app-name.vercel.app`

---

## ✅ Step 4: Test Your Live Website

### 4.1 Test Frontend
1. Visit your Vercel URL
2. You should see the beautiful landing page
3. Try the search functionality

### 4.2 Test Backend
1. Visit `https://your-railway-url.railway.app/health`
2. You should see: `{"status":"OK","database":"connected"}`

### 4.3 Test Full Integration
1. Try registering a new account on your website
2. Search for products
3. Everything should work end-to-end!

---

## 🎯 Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain to Vercel
1. In Vercel dashboard, go to your project
2. Click **"Domains"** 
3. Add your custom domain (e.g., `appliancedeals.com`)
4. Follow DNS configuration instructions

### 5.2 Update Environment Variables
1. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
2. Redeploy if needed

---

## 💰 Step 6: Enable Monetization (Optional)

### 6.1 Add Affiliate Links
1. Sign up for affiliate programs:
   - Amazon Associates
   - Home Depot Affiliate Program
   - Lowe's Affiliate Program
2. Add your affiliate IDs to Railway environment variables:

```env
AMAZON_ASSOCIATE_TAG=your-amazon-tag
HOMEDEPOT_AFFILIATE_ID=your-homedepot-id
LOWES_AFFILIATE_ID=your-lowes-id
```

### 6.2 Add Email Alerts
1. Sign up for SendGrid (free tier: 100 emails/day)
2. Get your API key
3. Add to Railway environment variables:

```env
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@yourdomain.com
```

### 6.3 Add AI Recommendations
1. Sign up for OpenAI API
2. Add your API key:

```env
OPENAI_API_KEY=your-openai-key
```

---

## 🔧 Troubleshooting

### Common Issues:

**1. "Application Error" on Railway**
- Check the **"Logs"** tab in Railway dashboard
- Ensure all environment variables are set correctly

**2. Frontend can't connect to backend**  
- Verify `NEXT_PUBLIC_API_URL` points to your Railway URL
- Check Railway service is running

**3. Database connection errors**
- Ensure `DATABASE_URL` is set to `${{Postgres.DATABASE_URL}}`
- Check PostgreSQL service is running in Railway

**4. Build failures**
- Check the build logs in Vercel/Railway
- Ensure all dependencies are in package.json

---

## 🎉 You're Live!

Congratulations! Your Appliance Price Tracker is now live on the internet! 

**What you have:**
- ✅ Professional price comparison website
- ✅ User registration/login system  
- ✅ Price tracking & alerts
- ✅ Mobile-responsive design
- ✅ Ready for monetization
- ✅ Scalable cloud infrastructure

**Next Steps:**
- Share your website URL with friends
- Start marketing to get users
- Set up affiliate accounts to earn money
- Add more product categories
- Monitor analytics and performance

**Free Tier Limits:**
- **Vercel**: 100GB bandwidth/month
- **Railway**: 500 hours/month compute + 1GB PostgreSQL
- **Perfect for starting out!**

---

## 📞 Need Help?

If you run into any issues:
1. Check the troubleshooting section above
2. Look at the deployment logs in Vercel/Railway
3. The app includes comprehensive error handling

Your website should be live and working! 🚀 