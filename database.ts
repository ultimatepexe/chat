import mongoose from "mongoose";
import dotenv from "dotenv"; dotenv.config();

const DATABASE: string | undefined = process.env.DATABASE;
if (!DATABASE) throw new Error("Database doesn't exists.");

interface IPost {
    date: Date;
    content: string;
    username: string;
}

const postSchema = new mongoose.Schema<IPost>({
    date: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    }
}, { collection: "posts" }); const Post = mongoose.model("Post", postSchema);

export async function connectToDatabase(): Promise<void> {
    await mongoose.connect(DATABASE!, { serverSelectionTimeoutMS: 10000 });
    console.log("Connected...");
}

export async function loadPosts(): Promise<IPost[]> {
    return await Post.find();
}

export async function createPost(content: string, username?: string): Promise<IPost> {
    const LIMIT = 100;
    const count = await Post.countDocuments();

    if (count >= LIMIT) await Post.findOneAndDelete({}, { sort: { date: 1 } });

    const newPost = await new Post({
        date: new Date(),
        content: content,
        username: username || "Anonymous",
    }).save();

    return newPost.toObject();
}