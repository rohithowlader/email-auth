import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        requied: true,
      },
    lastLogin: {
        type : Date,
        default: Date.now()
      },
},{timestamps:true});


userSchema.methods.generateJWT = () => {
    const token= jwt.sign({
        _id:this._id,
        email:this.email
    },process.env.JWT_SECRET_KEY, {expiresIn: "10d"})
}
const User = mongoose.model("User", userSchema);
export default User;