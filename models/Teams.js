const mongoose = require("mongoose");
const { Schema } = mongoose;

const teamsDataSchema = new Schema(
  {
    team: String,
    players_used: Number,
    cards_yellow: Number,
    cards_red: Number,
    cards_yellow_red: Number,
    fouls: Number,
    fouled: Number,
    offsides: Number,
    crosses: Number,
    interceptions: Number,
    tackles_won: Number,
    pens_won: Number,
    pens_conceded: Number,
    goals: Number,
    own_goals: Number,
    ball_recoveries: Number,
    aerials_won: Number,
    aerials_lost: Number,
    shots_total: Number,
    shots_on_target: Number,

    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    goals_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goals",
    },
    shots_total_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShotsTotal",
    },
    shots_on_target_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShotsOnTarget",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teams", teamsDataSchema);
