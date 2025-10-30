// backend/models/sessionModel.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // references User model
      }
    ]
  },
  { timestamps: true } // already includes createdAt & updatedAt
);

// Add an index for better query performance on createdBy/participants
sessionSchema.index({ createdBy: 1 });
sessionSchema.index({ participants: 1 });

const Session = mongoose.model("Session", sessionSchema);
export default Session;
