import app from './app';

const PORT: number = Number(process.env.PORT) || 3000;

// Encapsulated startup function
async function startServer(): Promise<void> {
  try {
    // 💡 Connect to databases (e.g., MongoDB, PostgreSQL, Redis) here first
    // await database.connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server successfully running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
}

startServer();