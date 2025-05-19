import { connectToDatabase, loadPosts, createPost } from "./database.ts";
import express, { type Request, type Response } from "express";
import dotenv from "dotenv"; dotenv.config();
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;
const app = express();
const clients: Response[] = [];

interface IPost {
    date: Date;
    content: string;
    username: string;
}

interface IFormatedPost {
    date: string;
    content: string;
    username: string;
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req: Request, res: Response) => {
    res.type(".html");
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/posts", async (req: Request, res: Response) => {
    const posts = await loadPosts();
    res.json({ posts });
});

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function notifyClients(post: IFormatedPost) {
    for (const client of clients) {
        client.write(`data: ${JSON.stringify(post)}\n\n`);
    }
}

function formatPost(post: IPost): IFormatedPost {
    const formatedPost: IFormatedPost = {
        date: post.date.toLocaleString("en", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }),
    content: escapeHtml(post.content),
    username: escapeHtml(post.username)
    }
    return formatedPost;
}

app.post("/create", async (req: Request, res: Response): Promise<void> => {
    const content: string = (req.body.content || "").trim();
    const username: string = (req.body.username || "").trim();
    if (content === "" || content.length > 1000) {
        res.status(400).json({ ok: false, error: "Invalid content length" }); return;
    }
    if (username.length > 30) {
        res.status(400).json({ ok: false, error: "Username too long" }); return;
    }
    const newPost = formatPost(await createPost(content, username));
    notifyClients(newPost);
    res.status(201).json({ ok: true });
});

app.get("/events", (req: Request, res: Response): void => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    clients.push(res);

    req.on("close", (): void => {
        const index = clients.indexOf(res);
        if (index !== -1) clients.splice(index, 1);
    });
});

app.listen(PORT, async (): Promise<void> => {
    await connectToDatabase();
    console.log(`Running at ${PORT}`);
});