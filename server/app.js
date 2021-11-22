const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/images");
  },
  filename: function (req, file, cb) {
    const originalFile = file.originalname;
    const idx = originalFile.lastIndexOf(".");
    const ext = originalFile.substring(idx);

    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + ext);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static("uploads"));

const products = [];

const users = {
  "test@gmail.com": {
    name: "Madhavendra",
    password: "12345",
  },
};

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", upload.single("file"), (req, res) => {
  console.log(req.file);
  const product = {
    ...req.body,
    img: "http://localhost:8080/images/" + req.file.filename,
  };
  products.push(product);

  res.sendStatus(201);
});

app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  const user = users[email];
  console.log(user, email)
  if (!user || user.password !== password) {
    return res.status(400).json({ message: "user is not valid" });
  }

  res.json({
    user,
  });
});

app.listen(8080, () => {
  console.log("listening on 8080");
});
