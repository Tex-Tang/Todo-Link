# Todo Link

An accessible, session-based task management app (aka todolist).

## Features

- Share tasks list with your friends!
- Navigate, modify your task list without touching mouse.
- Easy-to-use user interface

## Technology Stack

**Backend** : Golang ([fiber](https://gofiber.io/)) + PostgreSQL + [golang-migrate](https://github.com/golang-migrate/migrate)

**Frontend** : React ([Vite.js](https://vitejs.dev/)) + Tailwind.css

## Project Structure

```js
Todo-Link
├── client
│  ├── src
│  │   ├── api           //
│  │   ├── components    //
│  │   ├── hooks         //
│  │   └── main.tsx      // Entry point
│  └── index.html
└── server               // 錯誤代碼
   ├── migrations        // golang-migrate
   ├── model             // Data models
   ├── router            // API Routes
   ├── config.go         // To read app config
   ├── app.toml          // Backend config file
   └── main.go
```
