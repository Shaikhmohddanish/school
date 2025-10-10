import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

if (!process.env.MONGO_DB_NAME) {
  throw new Error('Please add your MongoDB database name to .env.local')
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGO_DB_NAME
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>


  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()


// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Helper function to get database
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
  
}

// Helper function to get a specific collection
export async function getCollection(collectionName: string) {
  const db = await getDatabase()
  return db.collection(collectionName)
}