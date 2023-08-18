const {model, Schema} = require("mongoose");

const userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  balance: {type: Number, required: true},
  bets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'bet',
    },
  ],
});

module.exports = model("user", userSchema);
