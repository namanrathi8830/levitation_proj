# MongoDB Atlas Setup Guide

## Quick Setup Instructions

### Option 1: Use Local MongoDB (Recommended for Development)

1. **Install MongoDB locally**:

   ```bash
   # macOS
   brew install mongodb-community

   # Ubuntu/Debian
   sudo apt install mongodb

   # Windows - Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB**:

   ```bash
   mongod --dbpath /data/db
   ```

3. **Update .env file**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/levitation-assignment
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account**:
   - Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for free

2. **Create a Cluster**:
   - Choose "Build a Database"
   - Select "M0 Sandbox" (Free tier)
   - Choose your preferred region
   - Create cluster

3. **Create Database User**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `levitation`
   - Password: `levitation123` (or your choice)
   - Select "Read and write to any database"

4. **Configure Network Access**:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)
   - Or add your specific IP address

5. **Get Connection String**:
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

6. **Update .env file**:
   ```env
   MONGODB_URI=mongodb+srv://levitation:levitation123@cluster0.xxxxx.mongodb.net/levitation-assignment?retryWrites=true&w=majority
   ```

## Testing the Connection

1. **Start the backend**:

   ```bash
   cd backend
   npm run dev
   ```

2. **Check health endpoint**:

   ```bash
   curl http://localhost:5001/api/health
   ```

3. **Expected response**:
   ```json
   {
     "success": true,
     "message": "Levitation Backend API is running!",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

## Troubleshooting

### Connection Errors

- Ensure your IP is whitelisted in MongoDB Atlas
- Check that username/password are correct
- Verify the database name in the connection string

### Local MongoDB Issues

- Make sure MongoDB service is running
- Check that port 27017 is not in use by another service
- Ensure you have proper permissions for the data directory

## Environment Variables Reference

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your-mongodb-connection-string

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```
