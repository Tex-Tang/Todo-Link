# Todo Link

An accessible, session-based task management app (aka todolist).

## Features

- Share tasks list with your friends!
- Navigate, modify your task list without touching mouse.
- Easy-to-use user interface

## Technology Stack

**Backend** : Golang ([fiber](https://gofiber.io/)) + PostgreSQL + https://github.com/golang-migrate/migrate

**Frontend** : React ([Vite.js](https://vitejs.dev/)) + Tailwind.css

## Project Structure

```js
Todo-Link
├── client               // Frontend
│  ├── src
│  │   ├── api
│  │   ├── components
│  │   ├── hooks
│  │   └── main.tsx      // Entry point
│  └── index.html
└── server               // Backend
   ├── migrations        // Golang-migrate
   ├── model             // Data models
   ├── router            // API Routes
   ├── config.go         // For reading config
   ├── app.toml          // Config file
   └── main.go
```
