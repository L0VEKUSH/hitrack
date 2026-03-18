const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: String, required: true },
  photo: { type: String, default: "" }, // URL for player photo

  // Batting stats
  matches: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  highestScore: { type: Number, default: 0 },
  fifties: { type: Number, default: 0 },
  hundreds: { type: Number, default: 0 },

  // Format-specific runs
  iplRuns: { type: Number, default: 0 },
  internationalRuns: { type: Number, default: 0 },
  testRuns: { type: Number, default: 0 },
  odiRuns: { type: Number, default: 0 },
  t20Runs: { type: Number, default: 0 },

  // Bowling stats
  wickets: { type: Number, default: 0 },
  ballsBowled: { type: Number, default: 0 },
  runsConceded: { type: Number, default: 0 },
  bestBowling: { type: String, default: "0/0" }, // wickets/runs

  // Last 10 matches performance
  last10Matches: { type: [Number], default: [] }, // array of last 10 match runs
}, { timestamps: true });

// Virtuals
PlayerSchema.virtual("battingAverage").get(function() {
  return this.matches > 0 ? (this.runs / this.matches).toFixed(2) : 0;
});

PlayerSchema.virtual("strikeRate").get(function() {
  return this.balls > 0 ? ((this.runs / this.balls) * 100).toFixed(2) : 0;
});

PlayerSchema.virtual("economy").get(function() {
  return this.ballsBowled > 0 ? ((this.runsConceded / this.ballsBowled) * 6).toFixed(2) : 0;
});

module.exports = mongoose.model("Player", PlayerSchema);