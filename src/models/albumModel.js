import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    albumName: {
        type: String,
        required: true,
    },
    albumImg: {
        type: String,
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    albumType: {
        type: String,
        enum: ["public", "private", "shared"],
        default: "public",
    },
    creator: {
        type: String
    },
    description: {
        type: String,
    }
}, {timestamps: true});

const Album = mongoose.models.Album || mongoose.model("Album", albumSchema, "albums");

export default Album;