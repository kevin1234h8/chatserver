const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      minLength: 3,
      maxLength: 16,
      require,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      minLength: 8,

      require,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
