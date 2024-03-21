import { Router } from "express";
import authRoutes from "./auth/auth.controllers";

const routes = Router()
    .get('/', (req, res) => { return res.send("SERVER IS RUNNING") })
    .use(authRoutes)

export default routes.use('/api/', routes)