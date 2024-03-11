import dotenv from "dotenv";
import express from "express";
import bodyParser from 'body-parser';
import * as routes from "./routes";
import { logger } from "./logger";

dotenv.config();

const port = process.env.SERVER_PORT;
const serverHost = process.env.SERVER_HOST;

const app = express();
// Middleware
app.use(bodyParser.json());
app.use(express.json());


// test route
app.get('/', (req, res) => {
  const welcomeMessage = {
    message: 'Welcome to the Express JSON API!'
  };
  res.json(welcomeMessage);
});

// Configure routes
routes.register(app);

// start the express server
app.listen(port, () => {
  logger.info(`server started at ${serverHost}:${port}`);
});
