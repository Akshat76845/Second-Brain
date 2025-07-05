import express from "express";
import jwt from "jsonwebtoken"
import { UserModel, ContentModel } from "./db"
import  { JWT_PASSWORD } from "./config"
import { userMiddleware } from "./middleware";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.post("/api/v1/signup",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try {
    UserModel.create({
        username: username,
        password: password

    })
    res.json({
        message: "User signed up"
    })
}
catch(e){
    res.status(411).json({
        message: "User already exists"
    })
}
})
app.post("/api/v1/signin", async (req,res)=>{
    const username = req.body.username; 
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    })

    if (existingUser){
        const token = jwt.sign({
            id: existingUser._id
        },JWT_PASSWORD)
    }
})

app.post("/api/v1/content",userMiddleware, async(req,res)=>{
    const link = req.body.link;
    const type = req.body.type;

    await ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })

    res.json({
        message: "Content added"
    })
})
app.get("api/v1/content", userMiddleware, async(req,res)=> {
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId","username")
    res.json({
        content
    })
})
app.delete("/api/v1/content",userMiddleware, async (req,res)=>{
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    })
    res.json({
        message: "Delete endpoint"
    })
})

app.post("/api/v1/brain/share",userMiddleware,async(req,res)=>{
    const share = req.body.share;
    if (share){
        await LinkModel.create({
            userId: req.userId,
            hash: random(10)
        })
    } else {
        await LinkModel.deleteOne({
            userId: req.userId
        });
    }
    res.json({
        message: "Updated shareable link"
    })
})
app.get("/api/v1/brain/:shareLink)
app.listen(3000);