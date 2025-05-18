import mongoose from "mongoose";
import dotenv from "dotenv"; dotenv.config();

const DATABASE: string | undefined = process.env.DATABASE;
if (!DATABASE) throw new Error("Database doesn't exists.");

interface IPost {
    date: string;
    content: string;
    username?: string;
}

const postSchema = new mongoose.Schema<IPost>({
    date: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: false,
    }
}, { collection: "posts" }); const Post = mongoose.model("Post", postSchema);

export async function connectToDatabase(): Promise<void> {
    if (!DATABASE) throw new Error("Database doesn't exists.");
    await mongoose.connect(DATABASE, { serverSelectionTimeoutMS: 10000 });
    console.log("Connected...");
}

export async function loadPosts(): Promise<IPost[]> {
    return await Post.find();
}

export async function createPost(content: string, username?: string): Promise<IPost | null> {
    const LIMIT = 100;
    const count = await Post.countDocuments();

    if (count >= LIMIT) {
        await Post.findOneAndDelete({}, { sort: { date: 1 } });
    }

    const now = new Date();
    const dateStr = now.toLocaleString("en", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    if (!username) username = "Anonymous";

    await new Post({
        date: dateStr,
        content: content,
        username: username,
    }).save();

    return { date: dateStr, content: content, username: username }
}