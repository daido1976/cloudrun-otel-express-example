import "./instrumentation";
import express from "express";
import { traceLogger } from "./tracer";

const PORT: number = parseInt(process.env.PORT || "8080");
const app = express();
const projectId = process.env.GOOGLE_CLOUD_PROJECT || "test-project-id";

app.use(traceLogger(projectId));

app.get("/", (_req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
