const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/user");
const Conversation = require("./models/conversation");
const Message = require("./models/message");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "https://kevin-chatweb.netlify.app",
    credentials: true,
  })
);
app.use(express.json());

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("connected");
});

//*users

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const singleUser = await User.findOne({ _id: req.params.userId });
    res.send(singleUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/users/create", async (req, res) => {
  const { username, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = User.create({
      username,
      email,
      password: hashPassword,
    });

    const saveNewUser = await (await newUser).save();
    res.send(saveNewUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

//*conversation

app.post("/conversations/create", async (req, res) => {
  try {
    const newConversation = Conversation.create(req.body);
    const saveNewConversation = await (await newConversation).save();
    res.status(200).json(saveNewConversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.send(conversations);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/conversations/:conversationId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.conversationId] },
    });
    res.send(conversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

//*messsage

app.post("/messages/create", async (req, res) => {
  try {
    const newMessage = Message.create(req.body);
    const saveNewMessage = await (await newMessage).save();
    res.status(200).json(saveNewMessage);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/messages/:messageId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.messageId,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

//*login

app.post("/login", async (req, res) => {
  const { password, username } = req.body;
  const user = await User.findOne({ username: username });
  if (await bcrypt.compare(password, user?.password)) {
    res.json({ message: "Login success", data: user });
  } else {
    res.status(500).send("Wrong username and Password combination");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`running at port ${process.env.PORT}`);
});
