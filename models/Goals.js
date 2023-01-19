const mongoose = require("mongoose");
const { Schema } = mongoose;

const goalsSchema = new Schema(
    {
        name: { type: Number, required: [true, 'Goals is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Goals", goalsSchema);