import express from "express";
import helmet from "helmet";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());

app.all("*", (req, res) => res.sendStatus(404));

app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));
