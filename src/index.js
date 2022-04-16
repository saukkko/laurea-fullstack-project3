import express from "express";
import helmet from "helmet";
import { router } from "./routes.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());
app.use(express.text({ type: "application/json" }));
app.use(express.static("./src/static", { maxAge: 3600 * 1000 * 0.5 }));
app.use(router);

app.all("*", (req, res) => res.sendStatus(404));

app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));
