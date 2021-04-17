import { ApolloServer } from "apollo-server";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let links = [
  { id: "user-1", description: "this is a test", url: "www.howtographql.com" },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Mutation: {
    post: (parent, arg) => {
      const link = {
        id: `user-${idCount++}`,
        description: arg.description,
        url: arg.url,
      };
      links.push(link);
      return link;
    },

    updatePost: (parent, arg) => {
      let updateIndex = links.findIndex((l) => l.id === arg.id);
      let newPost = links
        .filter((link) => link.id === arg.id)
        .map((d) => ({ d, ...arg }));
      links.splice(updateIndex, 1);
      links.push(newPost[0]);
      return newPost[0];
    },
    deletePost: (parent, arg) => {
      let deleteIndex = links.findIndex((l) => l.id === arg.id)
      links.splice(deleteIndex, 1);
      return links
    }
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server running on ${url}`));
