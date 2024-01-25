const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Define user schema fields
  name: String,
  // Add more fields as needed
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
