# 🔗 Snip - URL Shortener & Analytics

A full-stack web application for shortening URLs and tracking detailed analytics with real-time statistics.

## 🌟 Features

- **URL Shortening**: Create short, shareable links
- **QR Code Generation**: Generate QR codes for each link
- **Analytics Dashboard**: Real-time analytics with charts
- **Click Tracking**: Track every click with metadata
- **Device Detection**: Browser, OS, and device type tracking
- **Geolocation**: Track clicks by country/city
- **Traffic Analytics**: 7-day traffic visualization
- **Link Management**: Edit, delete, and manage links
- **User Authentication**: Secure JWT-based authentication
- **Responsive UI**: Modern, mobile-friendly interface

## 🏗️ Architecture

```
Frontend (React + Vite)
        ↓
Backend API (Node.js + Express)
        ↓
Database (MongoDB)
```

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/JATIN-JAY/Snip.git
cd Snip

# 2. Install dependencies
cd snip-backend && npm install
cd ../snip-frontend-main/snip-frontend-main && npm install

# 3. Create .env files
cp snip-backend/.env.example snip-backend/.env
cp snip-frontend-main/snip-frontend-main/.env.example snip-frontend-main/snip-frontend-main/.env

# 4. Start backend
cd snip-backend && npm run dev
# Backend runs on http://localhost:3000

# 5. Start frontend (in new terminal)
cd snip-frontend-main/snip-frontend-main && npm run dev
# Frontend runs on http://localhost:5174
```

### Docker Deployment

```bash
# 1. Build and run with Docker Compose
docker-compose up --build

# 2. Access application
# Frontend: http://localhost
# Backend: http://localhost:3000
```

For detailed Docker setup, see [DOCKER.md](DOCKER.md)

## 📁 Project Structure

```
snip-backend/
├── index.js                 # Main server file
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   ├── User.js             # User schema
│   ├── Link.js             # Shortened link schema
│   └── Click.js            # Click tracking schema
├── routes/
│   ├── auth.js             # Authentication endpoints
│   └── links.js            # Link management endpoints
├── Dockerfile              # Docker image configuration
└── package.json

snip-frontend-main/
└── snip-frontend-main/
    ├── src/
    │   ├── components/
    │   │   ├── analytics/  # Chart components
    │   │   ├── dashboard/  # Dashboard components
    │   │   ├── modals/     # Modal dialogs
    │   │   └── ui/         # UI components
    │   ├── pages/          # Page components
    │   ├── lib/
    │   │   ├── api.js      # API client
    │   │   └── utils.js    # Utilities
    │   └── main.jsx        # Entry point
    ├── Dockerfile          # Docker image configuration
    ├── nginx.conf          # Nginx configuration
    └── package.json
```

## 🔧 API Documentation

### Authentication

**Sign Up**
```
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Sign In**
```
POST /api/auth/signin
{
  "email": "john@example.com",
  "password": "password123"
}
Response: { token: "jwt_token" }
```

### Links

**Create Link**
```
POST /api/links
Header: Authorization: Bearer <token>
{
  "originalUrl": "https://github.com",
  "title": "GitHub",
  "customAlias": "github",
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

**Get All Links**
```
GET /api/links
Header: Authorization: Bearer <token>
```

**Get Link Details**
```
GET /api/links/:id
Header: Authorization: Bearer <token>
```

**Update Link**
```
PUT /api/links/:id
Header: Authorization: Bearer <token>
```

**Delete Link**
```
DELETE /api/links/:id
Header: Authorization: Bearer <token>
```

**Get Analytics**
```
GET /api/links/:id/analytics
Header: Authorization: Bearer <token>
```

### Redirect

**Redirect to Original URL**
```
GET /:shortId
(Redirects to original URL and tracks the click)
```

## 🛠️ Environment Variables

### Backend (.env)

```
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/snip
JWT_SECRET=your_secret_key_here
NODE_ENV=production
```

### Frontend (.env)

```
VITE_BACKEND_URL=http://localhost:3000
```

## 📊 Tech Stack

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **CORS** - Cross-origin support

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Analytics charts
- **Shadcn UI** - Component library

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Nginx** - Web server (frontend)
- **Git** - Version control

## 🧪 Testing

```bash
# Backend tests
cd snip-backend
npm test

# Frontend tests
cd snip-frontend-main/snip-frontend-main
npm test
```

## 📈 Deployment

### Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### AWS
- ECS for containers
- RDS for MongoDB
- CloudFront for CDN

### DigitalOcean
- App Platform (auto-deploy from GitHub)
- Managed Database
- Starting at $12/month

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed cloud deployment guides.

## 🔒 Security

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS enabled
- ✅ Environment variables for secrets
- ✅ Input validation
- ✅ MongoDB injection prevention

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**Jatin Singh**
- GitHub: [@JATIN-JAY](https://github.com/JATIN-JAY)
- Email: jatin@example.com

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For support, email jatin@example.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Icons from [Shadcn UI](https://ui.shadcn.com/)
- Charts from [Recharts](https://recharts.org/)
- Styling with [TailwindCSS](https://tailwindcss.com/)

---

**Happy Linking! 🔗**
