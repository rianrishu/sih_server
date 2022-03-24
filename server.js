require('dotenv').config()


const mongoose = require('mongoose');
const express = require("express")
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require("cors");



//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users")


//DB connection
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
    //  useUnifiedTopology: true
    // useCreateIndex : true
}).then(()=> {
    console.log("DB CONNECTED")
})


//Middlewares
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My routes
app.use("/auth",authRoutes);
app.use("/api", userRoutes);


// app.use(express.static(path.join(__dirname, "/projfrontend/build")));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/projfrontend/build', 'index.html'));
// }); 


//ports
const port = 3000;


//starting a server
app.listen(port, () => {
    console.log(`app is running at ${port}`);
})