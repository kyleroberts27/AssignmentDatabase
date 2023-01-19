const mongoose = require("mongoose");
const { Schema } = mongoose;

const totalShotsSchema = new Schema(
    {
        name: { type: number, required: [true, 'Number is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ShotTotal", totalShotsSchema);