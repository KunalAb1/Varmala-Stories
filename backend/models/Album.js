import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["wedding", "prewedding", "haldi", "engagement", "models", "kids", "general", "hero"],
      default: "wedding",
    },
    coverImageUrl: { type: String },
    location: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Album", albumSchema);