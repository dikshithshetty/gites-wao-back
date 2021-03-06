import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import connectDB from './config/db';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import gitesRoutes from './routes/gitesRoutes';
import userRoutes from './routes/userRoutes';
import uploadRoutes from './routes/uploadRoutes';
import reviewRoutes from './routes/reviewRoutes';
import pagesRoutes from './routes/pagesRoutes';
import partenairesRoutes from './routes/partenairesRoutes';
import messageRoutes from './routes/messageRoutes';
import reservationRoutes from './routes/reservationRoutes';
import clientRoutes from './routes/clientRoutes';
import mailerRoutes from './routes/mailerRoutes';
import calendarRoutes from './routes/calendarRoutes';
// import AWS from 'aws-sdk';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	fileUpload({
		createParentPath: true,
	})
);

app.use(
	cors({
		origin: ['http://localhost:3000'],
	})
);
app.use(express.json());

app.use('/api', gitesRoutes);
app.use('/api', userRoutes);
app.use('/api', uploadRoutes);
app.use('/api', reviewRoutes);
app.use('/api', pagesRoutes);
app.use('/api', partenairesRoutes);
app.use('/api', messageRoutes);
app.use('/api', reservationRoutes);
app.use('/api', clientRoutes);
app.use('/api', mailerRoutes);
app.use('/api', calendarRoutes);

// app.get('/api/config/paypal', (req, res) =>
// 	res.send(process.env.PAYPAL_CLIENT_ID)
// );

// const __dirname = path.resolve();
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
	// app.use(express.static(path.join(__dirname, '/frontend/build')));
	// app.get('*', (req, res) =>
	// 	res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
	// );
} else {
	app.get('/', (req, res) => {
		res.send('API is running...');
	});
}

const PORT = process.env.PORT || 8080;

app.listen(
	PORT,
	console.log(
		`Server runnning in ${process.env.NODE_ENV} on port ${PORT}...`.yellow
			.bold
	)
);
