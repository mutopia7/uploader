# 📸 PhotoUploader

A modern and secure **Photo Upload & Management** web app built with **Node.js, Express, EJS, Prisma, Passport, Cloudinary, Alpine.js, and TailwindCSS**.  
Deployed seamlessly with **Vercel**.  

---

## 🚀 Features
- 🔐 **Authentication** with Passport.js (Login & Signup)
- 🗂️ **User-specific storage** (folders & file management)
- ☁️ **Cloud storage** via Cloudinary
- 🎨 **Dark/Light Mode** toggle with Alpine.js + TailwindCSS
- ✅ **Validation** with custom middleware
- 💾 **Session handling** stored in PostgreSQL (via Prisma)
- ⚡ **Responsive UI** with TailwindCSS + Alpine.js
- 🛡️ Secure deployment ready (Helmet, sessions, flash messages)

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Frontend:** EJS, TailwindCSS, Alpine.js
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** Passport.js (Local strategy)
- **Storage:** Cloudinary for images
- **Session Store:** PrismaSessionStore
- **Deployment:** Vercel

---

## 📂 Project Structure
```bash
├── prisma/                 # Database schema & migrations
├── src/
│   ├── app.js              # Express app entry
│   ├── config/             # DB, Passport, Cloudinary configs
│   ├── controllers/        # App controllers
│   ├── middlewares/        # Auth middlewares
│   ├── public/             # CSS, JS, static files
│   ├── routes/             # Express routes
│   ├── uploads/            # Temporary uploads (before Cloudinary)
│   ├── validators/         # Form validators
│   └── views/              # EJS templates (layouts & partials)
├── tailwind.config.js      # TailwindCSS config
├── postcss.config.js       # PostCSS config
├── package.json
└── vercel.json             # Vercel deployment config
```

---


## 👨‍💻 Author
Developed with ❤️ by **Rasool**  
📧 Contact: your.email@example.com  
🐙 GitHub: [mutopia7](https://github.com/mutopia7)


