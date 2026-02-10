const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },

  title: {
    type: String,
    required: true,
  },

  body: {
    type: String,
    required: true,
  },

  // 📎 Attachment info
  attachment: {
    filePath: {
      type: String, // /uploads/xxxxx.jpg
    },

    originalName: {
      type: String, // photo.jpg
    },

    mimeType: {
      type: String, // image/jpeg
    },

    size: {
      type: Number, // bytes
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update updatedAt
NoteSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Note", NoteSchema);