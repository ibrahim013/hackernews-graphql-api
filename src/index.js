import { ApolloServer, PubSub } from "apollo-server";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import pkg from "@prisma/client";
import { getUserId } from "./utils.js";
import Query from "./resolvers/Query.js";
import Mutation from "./resolvers/Mutation.js";
import User from "./resolvers/User.js";
import Link from "./resolvers/Link.js";
import Subscription from "./resolvers/Subscription.js";
import Vote from "./resolvers/Vote.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const pubsub = new PubSub();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server running on ${url}`));
