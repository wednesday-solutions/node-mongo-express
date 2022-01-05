import express from "express";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import log from "../utils/logger";
import { mongoConnector } from "./middlewares/mongo";
import { apiSuccess } from "@utils/apiUtils";
import database from "./database";

/**
 * Connect to database
 */
let db = mongoConnector();

/**
 * Create express server
 */
const app = express();

app.set("port", process.env.PORT || 9000);
app.use(helmet());
app.use(cors());
// get information from html forms
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// setup database
database(app);

app.get("/", (req, res) => {
  apiSuccess(res, "node-parcel-express-mongo server at your service🖖");
});

module.exports = app;
