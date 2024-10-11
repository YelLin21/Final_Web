import mongoose from "mongoose";
const customerSchema = new mongoose.Schema({
    name: String,
    dateofbirth: Date,
    membernumber: Number,
    interests: String,
});

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;