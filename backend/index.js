const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const Post = require("./Models/Post");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config({ path: "../.env" });

const app = express();

const salt = bcrypt.genSaltSync(10);

// env variables

const secret = process.env.SECRET;
const mongodbUrl = process.env.MONGODB_URL;
const PORT = process.env.PORT;

// app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Handle preflight OPTIONS requests

app.options("*", cors());

// middleware to set headers

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//other middlewares

app.use(express.json());

app.use(cookieParser());

app.use("/uploads", express.static(__dirname + "/uploads"));

// connect to database

mongoose.connect(mongodbUrl, {});

// test server

app.get("/test", (req, res) => {
  res.json("Hello World");
});

// register user

app.post("/register", async (req, res) => {
  const { username, password, name, email, phone, age, bio } = req.body;
  try {
    const user = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
      name,
      email,
      phone,
      age,
      bio,
    });
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

// login user

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, user.password);
  if (passOk) {
    //loggedin
    jwt.sign(
      {
        username,
        id: user._id,
      },
      secret,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: user._id,
          username,
        });
      }
    );
  } else {
    //not logged in
    res.status(400).json("wrong credentials");
  }
});

// get user profile

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

// logout user

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("Logged Out");
});

// create post

app.post("/post", upload.single("file"), async (req, res) => {
  // Upload to Cloudinary
  // Configuration
  cloudinary.config({
    cloud_name: "dnfsluglr",
    api_key: "862897249648926",
    api_secret: "yV9whjHUSO28AzUZe9bbTnqTI0s",
  });

  // Upload the file from the request
  const uploadResult = await cloudinary.uploader
    .upload(req.file.path, {
      public_id: "post_image",
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: "Failed to upload file" });
    });

  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const extension = parts[parts.length - 1];
  const newPath = path + "." + extension;
  fs.renameSync(path, newPath);

  const { title, summary, content, userProfile } = req.body;
  const author = userProfile;

  const post = await Post.create({
    title,
    summary,
    content,
    cover: uploadResult.secure_url,
    author,
  });

  res.json(post);
});

// update existing post

app.put("/post", upload.single("file"), async (req, res) => {
  // Upload to Cloudinary
  // Configuration
  cloudinary.config({
    cloud_name: "dnfsluglr",
    api_key: "862897249648926",
    api_secret: "yV9whjHUSO28AzUZe9bbTnqTI0s",
  });

  // Upload the file from the request
  const uploadResult = await cloudinary.uploader
    .upload(req.file.path, {
      public_id: "post_image",
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: "Failed to upload file" });
    });

  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { id, title, summary, content, userProfile } = req.body;
  const author = userProfile;
  const post = await Post.findById(id);
  const isAuthor = JSON.stringify(post.author) === JSON.stringify(author);
  if (!isAuthor) {
    return res.status(400).json("you are not the author");
  }
  await post.updateOne({
    title,
    summary,
    content,
    // cover: newPath ? newPath : post.cover,
    cover: uploadResult.secure_url,
  });

  res.json(post);
});

//get all posts

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

//get single post

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("author", ["username"]);
  res.json(post);
});

// like post

app.put("/post/:id/like", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = await Post.findById(id);
  post.likedBy.push(userId);
  post.likes = post.likes + 1;
  await post.save();
  res.json(post);
});

// unlike post

app.put("/post/:id/unlike", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = await Post.findById(id);
  post.likedBy = post.likedBy.filter((id) => id !== userId);
  post.likes = post.likes - 1;
  await post.save();
  res.json(post);
});

// delete post

app.delete("/post/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);
  res.json(post);
});

// profile page
app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;
  const posts = await Post.find({ author: id }).populate("author", [
    "username",
  ]);
  const user = await User.findById(id);
  res.json({ user, posts });
});

// edit profile
app.put("/profile/:id", async (req, res) => {
  // const { userId, username, name, email, phone, age } = req.body;
  const { id } = req.params;
  const { bio, name, email, phone, age } = req.body;
  const userId = id;
  const user = await User.findById(userId);
  if (bio) {
    user.bio = bio;
  }
  if (name) {
    user.name = name;
  }
  if (email) {
    user.email = email;
  }
  if (phone) {
    user.phone = phone;
  }
  if (age) {
    user.age = age;
  }
  await user.save();

  res.json(user);
});

// delete profile
app.delete("/profile/:id", async (req, res) => {
  const { id } = req.params;
  // Delete all posts associated with the user
  await Post.deleteMany({ author: id });
  // Delete the user profile
  const user = await User.findByIdAndDelete(id);
  res.json(user);
});

// get all users
app.get("/users", async (req, res) => {
  res.json(await User.find().sort({ createdAt: -1 }).limit(10));
});

// get top users
app.get("/topUsers", async (req, res) => {
  const topUsers = await User.aggregate([
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "author",
        as: "posts",
      },
    },
    { $addFields: { postCount: { $size: "$posts" } } },
    { $sort: { postCount: -1 } },
    { $limit: 10 },
    {
      $project: {
        username: 1,
        postCount: 1,
        name: 1,
        email: 1,
        phone: 1,
        age: 1,
      },
    },
  ]);
  res.json(topUsers);
  console.log(topUsers);
});

// listen to port

app.listen(PORT, () => {
  console.log("Server running on port 4000");
});
