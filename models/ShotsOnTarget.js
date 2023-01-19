const mongoose = require("mongoose");
const { Schema } = mongoose;

const shotsOnTargetSchema = new Schema(
    {
        name: { type: Number, required: [true, 'Number is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ShotsOnTarget", shotsOnTargetSchema);