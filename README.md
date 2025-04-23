# 📚 Library Management System

A full-stack Library Management System built with the **MERN** stack to manage books, members, and transactions like issuing and returning books.

---

## 🔧 Tech Stack

- **Frontend:** React.js (with Vite or CRA), React Router DOM, Axios
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Optional:** JSON fallback backend (for mock data), Auth protection

---

## 📸 Screenshots
![home] (img/Books.png)
![login]  (img/login.png)
![dashboard]  (img/Dashboard.png)
![books]  (img/books.png)


## 🚀 Getting Started

### 1. Backend (`/backend`)

**Setup:**

```bash
cd backend
npm install
```

Run the server
```
npm run server  # uses nodemon
# or
npm start
```

### 2. backend(`/backend`)

**Setup:**
```bash
cd ..
npx create-react-app frontend
# or
npm create vite@latest frontend -- --template react

cd frontend
npm install axios react-router-dom
```

**Start Frontend**
```bash
npm run dev  # for Vite
# or
npm start    # for CRA
```
### 🗂 Project Structure

```pgsql

library-management-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── memberController.js
│   │   └── transactionController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Book.js
│   │   ├── Member.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── memberRoutes.js
│   │   └── transactionRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   ├── auth.js
    │   │   ├── books.js
    │   │   ├── members.js
    │   │   └── transactions.js
    │   ├── assets/
    │   │   └── App.css
    │   ├── components/
    │   │   ├── BookForm.js
    │   │   ├── BookList.js
    │   │   ├── MemberForm.js
    │   │   ├── MemberList.js
    │   │   ├── IssueForm.js
    │   │   ├── ReturnForm.js
    │   │   └── Navbar.js
    │   ├── contexts/
    │   │   └── AuthContext.js
    │   ├── hooks/
    │   ├── pages/
    │   │   ├── AddBookPage.js
    │   │   ├── AddMemberPage.js
    │   │   ├── BooksPage.js
    │   │   ├── DashboardPage.js
    │   │   ├── IssueBookPage.js
    │   │   ├── LoginPage.js
    │   │   ├── MembersPage.js
    │   │   └── ReturnBookPage.js
    │   ├── App.js
    │   ├── index.js
    │   └── setupProxy.js
    ├── .env
    ├── .env.example
    ├── .gitignore
    └── package.json
```






