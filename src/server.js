require("express-async-errors");
const migrationsRun = require("./database/sqlite/migrations");

const AppError = require("./utils/appError");

const express = require("express");

const routes = require("./routes/index.js");

const uploadConfig = require("./configs/upload");

const app = express();
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

migrationsRun();

app.use((error, request, response, next) => {   
    console.log(error);
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: "error",
        message: error.message
        });
    };

    return response.status(500).json({
        status: "error",
        message: "internal server error"
    });
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));