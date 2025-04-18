import "./instrumentation";
import express from "express";

const PORT: number = parseInt(process.env.PORT || "8080");
const app = express();

app.get("/", (_req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
