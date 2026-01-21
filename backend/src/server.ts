import app from "./app";
import connectDB from "./db/config";

const PORT = 5000;

const startServer = async () => {
  try {
    await connectDB(); // 🔥 WAIT for MongoDB
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
