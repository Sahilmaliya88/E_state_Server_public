import { checkAsync } from "../lib/checkasync.js";
import prisma from "../lib/database.js";
export const createPost = checkAsync(async (req, res, next) => {
    const { title, user_id, description } = req.body;
    const post = await prisma.posts.create({
        data: {
            title: title,
            user_id: user_id,
            description: description
        }
    });
    res.status(201).json({
        status: "success",
        post: post,
    });
});
