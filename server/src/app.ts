import express, { Application, NextFunction, Request, Response } from 'express';
import routes from './routes/routes';
import initializeMiddlewares from './middleware/app.middleware';

const app: Application = express();

initializeMiddlewares(app);
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     res.status(400).json({error: err})
// })
app.use(routes)

export default app;