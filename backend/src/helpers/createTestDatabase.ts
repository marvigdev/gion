import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export type TestDatabase = {
  connect: () => Promise<void>;
  clear: () => Promise<void>;
  close: () => Promise<void>;
};

async function createTestDatabase(): Promise<TestDatabase> {
  const server = await MongoMemoryServer.create();

  const connect = async () => {
    const uri = server.getUri();
    mongoose.connect(uri);
  };

  const clear = async () => {
    const { collections } = mongoose.connection;

    const deletePromises = Object.values(collections).map(collection =>
      collection.deleteMany({}),
    );

    await Promise.all(deletePromises);
  };

  const close = async () => {
    await clear();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await server.stop();
  };

  return {
    connect,
    clear,
    close,
  };
}

export default createTestDatabase;
