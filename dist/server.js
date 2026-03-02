"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const identityRoutes_1 = __importDefault(require("./routes/identityRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// Routes
app.use('/', identityRoutes_1.default);
// Error Handling Middleware
app.use(errorHandler_1.errorHandler);
// Start server
const startServer = async () => {
    await (0, db_1.connectDB)();
    app.listen(PORT, () => {
        console.log(`backend is running on port ${PORT}`);
    });
};
startServer();
