# Real-time Chat with Node.js, Express, MongoDB and SSE

This project is a minimalist real-time chat application built with:

* **Node.js** + **Express** – for handling HTTP requests
* **MongoDB** + **Mongoose** – for storing and querying messages
* **Server-Sent Events (SSE)** – for pushing real-time updates to connected clients
* **HTML/CSS/TypeScript** – for the frontend interface

Messages are stored in a capped collection: when the message count reaches the limit (100), the oldest message is deleted to make room for new ones. The frontend automatically updates for all connected users in real time using SSE.

![Screenshot](/images/screenshot.png)

---

## Features

* Minimalist and responsive UI
* Real-time message updates using SSE
* Message length and username validations
* Automatic deletion of oldest messages when limit is reached
* Sanitization of user input to prevent HTML injection

---

## Requirements

* Node.js >= 18
* A running MongoDB instance (local or remote)

---

## Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
DATABASE=mongodb://localhost:27017/your_database_name
PORT=3000
```

> Replace `your_database_name` with the actual name of your MongoDB database.

---

## How to Run

1. Clone the repository:

```bash
git clone https://github.com/ultimatepexe/chat.git
cd chat
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node --experimental-strip-types index.ts
```

> The `--experimental-strip-types` flag allows Node.js to run `.ts` files directly without compiling TypeScript to JavaScript.

4. Open your browser and go to:

```
http://localhost:3000
```

---
