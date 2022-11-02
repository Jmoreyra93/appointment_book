const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config()

const dbConfig = require('./config/dbConfig')
app.use(cors());
app.use(express.json());
const userRoute = require('./routes/userRoute')
const adminRoute = require("./routes/adminRoute");
const professionalRoute = require("./routes/professionalsRoute");


app.use('/api/user', userRoute)
app.use("/api/admin", adminRoute);
app.use("/api/professional", professionalRoute);

const port = process.env.PORT || 5000;



app.listen(port, () => {
    console.log(` Node server listening on ${port}`);
});
