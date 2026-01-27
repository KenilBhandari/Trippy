import app from "./app";
import connectDB from "./db/config";
import 'dotenv/config'; // auto loads .env

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    console.log("Starting server");
    await connectDB(); // 🔥 WAIT for MongoDB
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
