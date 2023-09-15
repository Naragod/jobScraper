import { MongoClient } from "mongodb";

let dbClient: MongoClient;

export const getConnectionString = (username: string, password: string) => {
  return `mongodb+srv://${username}:${password}@jobbank.xe4gpy0.mongodb.net/`;
};

const getCollection = async (client: MongoClient, dbName: string, colString: string) => {
  try {
    const database = client.db(dbName);
    return database.collection(colString);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getMongoClient = (username: string, password: string): MongoClient => {
  if (dbClient == null) {
    const connectionString = getConnectionString(username, password);
    dbClient = new MongoClient(connectionString);
  }
  return dbClient;
};

export const closeConnection = async () => {
  await dbClient.close();
};

export const writeTransaction = async (client: MongoClient, dbName: string, collectionName: string, payload: any) => {
  const insertionDate = new Date().getTime();
  const collection = await getCollection(client, dbName, collectionName);
  const transaction = { insertionDate, ...payload };
  await collection.insertOne(transaction);
};
