const {model, Schema} = require('mongoose')

const betSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'user', required: true},
  match: {type: String, ref: 'match', required: true},
  teamId: {type: String, required: true},
  betAmount: {type: Number, required: true},
  betOdd: {type: Number, required: true},
  status: {type: String, required: true},
})

module.exports = model('bet', betSchema)
