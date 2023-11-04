const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/question");
const cors = require("cors")
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const PORT = process.env.PORT;

const URL = process.env.MONGODB;

mongoose
  .connect(URL, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    throw error;
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use("/api/auth", authRoutes);

app.use("/api", questionRoutes);
