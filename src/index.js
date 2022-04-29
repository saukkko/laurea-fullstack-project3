import express from "express";
import helmet from "helmet";
import { validateHeaders, validateJSON } from "./utils.js";
import { router } from "./routes.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());

/**
 * NOTE: express.json() middleware is really messy and floods the console with
 * errors if it fails to parse JSON payload. Instead we use regular text parser,
 * but apply it only to content-type application/json. Then we will use custom
 * middleware to make do clean and managed parsing of json.
 */
app.use(express.text({ type: "application/json" }));

// Apply our validation functions as middlewares for express
app.use(validateHeaders, validateJSON);
app.use(express.static("./src/static", { maxAge: 3600 * 1000 * 0.5 }));

app.use(router);

app.all("*", (req, res) => res.sendStatus(404));

app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));
