import mongoose from "mongoose";
import { hashSync } from "bcryptjs";

const Schema = mongoose.Schema;
export const UserSchema = new Schema(
  {
    email: { type: String },
    pass_hash: { type: String },
    salt_key: { type: String },
    username: { type: String, unique: true },
    name: { type: String }
  },
  {
    collection: "User",
    timestamps: true
  }
);

UserSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    this.password = this.hashPassword(this.password);
  }
  return next();
});

UserSchema.methods = {
  hashPassword(password) {
    return hashSync(password, 8);
  }
};

export const User = mongoose.model("User", UserSchema);
