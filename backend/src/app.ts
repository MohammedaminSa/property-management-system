import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import rootRouter from "./routes";
import errorHandlerMiddleware from "./middleware/error-handler";

const swaggerOutput = require("../swagger-output.json");

const app = express();

// ---------- Middleware ----------
app.set("trust proxy", 1);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

const CLIENT_FRONTEND_URL = process.env.CLIENT_FRONTEND_URL;
const ADMIN_FRONTEND_URL = process.env.ADMIN_FRONTEND_URL;

console.log("Environment variables:");
console.log("CLIENT_FRONTEND_URL:", CLIENT_FRONTEND_URL);
console.log("ADMIN_FRONTEND_URL:", ADMIN_FRONTEND_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

const allowedOriginPatterns = [
  /^https:\/\/property-management-system[\w-]*\.vercel\.app$/,
  /^https:\/\/property-management-system[\w-]*-mohammed-ahmedins-projects\.vercel\.app$/,
  /^https:\/\/[\w-]*-vercel\.app$/,
  /^https:\/\/property-management-system[\w-]*\.onrender\.com$/,
  /^https:\/\/solomongetnet\.pro\.et$/,
  /^http:\/\/localhost:(4000|5173|3000)$/,
  /^http:\/\/10\.27\.237\.146:(4000|5173|3000)$/,
];

const staticOrigins = [
  CLIENT_FRONTEND_URL,
  ADMIN_FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(`CORS check for origin: ${origin}`);
      if (!origin) return callback(null, true);
      if (staticOrigins.includes(origin)) {
        console.log(`CORS allowed (static): ${origin}`);
        return callback(null, true);
      }
      if (allowedOriginPatterns.some((p) => p.test(origin))) {
        console.log(`CORS allowed (pattern): ${origin}`);
        return callback(null, true);
      }
      // Temporary: Allow all origins for debugging
      console.warn(`CORS blocked but allowing for debugging: ${origin}`);
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ---------- Routes ----------
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

// ---------- Swagger ----------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// ---------- Routes ----------
app.use(rootRouter);

// Test endpoint (must be after main router)
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Backend is working!", 
    timestamp: new Date().toISOString(),
    origin: req.headers.origin 
  });
});

// ---------- Error Handler ----------
app.use(errorHandlerMiddleware);

// // ---------- Create HTTP server ----------
// const server = http.createServer(app);

// // ---------- Socket.IO ----------
// const io = new Server(server, {
//   cors: {
//     origin: ["*"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// ---------- Register Socket Handlers ----------
// registerSocketHandlers(io);
const PORT = process.env.PORT || 3000;

// export default app
// ---------- Start Server ----------
app.listen(PORT as any, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🚀 The new version is running`);
  console.log(`🚀 Friday 13 - hmmmm`);
  console.log(`📖 Swagger Docs in here http://localhost:${PORT}/api-docs`);
});

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`🚀 The new version is running`);
//   console.log(`📖 Swagger Docs in here http://localhost:${PORT}/api-docs`);
// });
