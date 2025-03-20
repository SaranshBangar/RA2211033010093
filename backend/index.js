const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  let errorResponse = {
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "production"
        ? {}
        : {
            name: err.name,
            message: err.message,
            stack: err.stack,
          },
  };

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    errorResponse = {
      message: "Invalid JSON in request body",
      error:
        process.env.NODE_ENV === "production"
          ? {}
          : {
              details: "Check for JSON syntax errors like missing quotes or commas",
              received: err.body,
            },
    };
    return res.status(400).json(errorResponse);
  }

  res.status(err.status || 500).json(errorResponse);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
