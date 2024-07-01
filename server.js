import express from 'express';
import dotenv from 'dotenv';

import userRoute from './routes/indexRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.set('trust proxy', true);

app.use(express.json());

app.use('/api', userRoute);

app.get('/', (req, res) => {
	res.send('Hello World').status(200);
});

app.get('*', (req, res) => {
	res.status(404).send('Page not found');
});

app.listen(port, () => {
	console.log(`Stage 1 Task is running on port: ${port}`);
});
