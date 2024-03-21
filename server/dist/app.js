"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const app_middleware_1 = __importDefault(require("./middleware/app.middleware"));
const app = (0, express_1.default)();
(0, app_middleware_1.default)(app);
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     res.status(400).json({error: err})
// })
app.use(routes_1.default);
exports.default = app;
