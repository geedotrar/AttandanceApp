//app
import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import models, { sequelize } from "./models/init-models";
import routes from "./routes/indexRoute";
import session from "express-session";
import db from "../config/db";
import SequelizeStore from "connect-session-sequelize";
// const path = require("path");

const port = process.env.PORT || 3002;

const app = express();
const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
app.use(helmet());
app.use(async (req, res, next) => {
  req.context = { models };
  next();
});
// app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static("public"));

// store.sync();

app.use("/users", routes.userRoute);
app.use("/absensi", routes.absensiRoute);
app.use("/kegiatan", routes.kegiatanRoute);
app.use("/auth", routes.authRoute);

const dropDatabaseSync = false;

sequelize.sync({ force: dropDatabaseSync }).then(async () => {
  if (dropDatabaseSync) {
    console.log("Database do not drop");
  }
  app.listen(port, () => {
    console.log("Server is listening on port " + port);
  });
});

export default app;
