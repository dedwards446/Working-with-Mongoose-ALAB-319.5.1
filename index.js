const express = require("express");
const bodyParser = require("body-parser");

const users = require("./routes/users");
const posts = require("./routes/posts");

const app = express();
const port = 3000;

// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  const time = new Date();

  console.log(`-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Valid API Keys
const apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// Middleware to check for API keys
app.use("/api", function (req, res, next) {
  var key = req.query["api-key"];

  if (!key) {
    return next({ status: 400, message: "API Key Required" });
  }

  if (apiKeys.indexOf(key) === -1) {
    return next({ status: 401, message: "Invalid API Key" });
  }

  req.key = key;
  next();
});

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Define user schema fields
  name: String,
  // Add more fields as needed
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

// Use Mongoose Models in Routes
app.use("/api/users", users(UserModel));
app.use("/api/posts", posts(UserModel));

// Adding some HATEOAS links
app.get("/", (req, res) => {
  res.json({
    links: [
      {
        href: "/api",
        rel: "api",
        type: "GET",
      },
    ],
  });
});

// Adding some HATEOAS links
app.get("/api", (req, res) => {
  res.json({
    links: [
      {
        href: "api/users",
        rel: "users",
        type: "GET",
      },
      {
        href: "api/users",
        rel: "users",
        type: "POST",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "GET",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "POST",
      },
    ],
  });
});

// 404 Middleware
app.use((req, res, next) => {
  next({ status: 404, message: "Resource Not Found" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500);
    res.json({ error: err.message });
  } else {
    next(); // Make sure to call next if there's no error
  }
});


app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});


/* unable to find this error 

 return fn.apply(this, args);
              ^

TypeError: Cannot read properties of undefined (reading 'apply')
    at C:\Users\ecece\sei-classwork\319-mongodb\Sandbox\node_modules\express\lib\router\index.js:646:15
*/