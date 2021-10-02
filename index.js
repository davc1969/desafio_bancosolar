const http = require("http");

const dotenv = require("dotenv").config();

const routes = require("./routes/routes")

const PORT = process.env.PORT || 3000;



http.createServer ( (req, res) => {

    routes(req, res);

})
.listen(PORT, () => {
    console.log(`Server is up and listening by port ${PORT} - Process ${process.pid}`);
})
