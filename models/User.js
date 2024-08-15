import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    phoneNumber: {
      type: String,
      required: true,

      match: /^05\d{8}$/, // תבנית לאימות מספר טלפון בדיוק 10 ספרות
    },
    picturePath: {
      type: String,
      default: "anonymous.jpg",
    },
    following: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
<<<<<<< HEAD
    following: {
      type: Array,
      default: [],
    },
=======
    // friends: {
    //   type: Array,
    //   default: [],
    // },
>>>>>>> 9faf482ac37890432b5dc8c7e8f694eaa9a327c0
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    
    stars: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);


const User = mongoose.model("User", UserSchema);

export default User;
