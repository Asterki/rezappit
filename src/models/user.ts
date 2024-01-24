import mongoose from "mongoose";

// Managed by next-auth
const schema = new mongoose.Schema({}, { strict: false, collection: "users" });

export default mongoose.models.Users || mongoose.model("Users", schema);
