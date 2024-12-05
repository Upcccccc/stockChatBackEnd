import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import apiRoutes from './src/router/index';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', apiRoutes);

// start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});