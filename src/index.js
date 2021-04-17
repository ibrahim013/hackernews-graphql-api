import { ApolloServer } from "apollo-server";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import pkg from "@prisma/client";
import { getUserId } from "./utils.js";
import Query from "./resolvers/Query.js";
import Mutation from "./resolvers/Mutations.js";
import User from "./resolvers/User.js";
import Link from "./resolvers/Link.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server running on ${url}`));
