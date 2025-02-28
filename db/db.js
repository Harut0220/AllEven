import mongoose from "mongoose";
  
const connect = async () =>{
    mongoose.set("strictQuery", false);
    console.log(process.env.MONGO_URL)
    await mongoose
    .connect(process.env.MONGO_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });

}

export default connect;