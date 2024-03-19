const partnerRoute = require("./routes/partner");
const reviewRoute = require("./routes/review");
const logsRoute = require("./routes/logs");
const logsManagerRoute = require("./middlewares/requestLogger");

const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5020;
const SIZE_LIMIT = "10mb";
const PUBLIC_PATH = path.join(__dirname);

app.use(cors({ origin: "*" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.static(PUBLIC_PATH));

// TODO : ajouter le middleware de journalisation pour tous les types de requêtes HTTP
app.use("/*", logsManagerRoute.requestLogger);

app.use((req, res, next) => {
  console.log(`Request ${req.method} on ${req.path} at ${new Date()}`);
  next();
});

// TODO : Rajouter les routeurs sur les bon prefixes
app.use("/api/partner", partnerRoute.router);
app.use("/api/review", reviewRoute.router);
app.use("/logs", logsRoute.router);

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = server;
