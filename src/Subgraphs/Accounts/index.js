import express from "express";
import { createYoga, createSchema } from "graphql-yoga";

import bcpMiddleware from "@chillicream/bananacakepop-express-middleware";

const typeDefs = `
  interface Node {
    id: ID!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type Query {
    node(id: ID!): Node
    nodes(ids: [ID!]!): [Node]!
    userById(id: ID!): User
    userByUsername(username: String!): User
    users(first: Int, after: String, last: Int, before: String): UsersConnection
  }

  type User implements Node {
    id: ID!
    name: String!
    birthdate: String!
    username: String!
  }

  type UsersConnection {
    pageInfo: PageInfo!
    edges: [UsersEdge!]
    nodes: [User!]
  }

  type UsersEdge {
    cursor: String!
    node: User!
  }

  scalar DateTime
`;

// Mock data for demonstration
const users = [
  {
    __typename: 'User',
    id: "1",
    name: "John Doe",
    birthdate: "2000-01-01T00:00:00Z",
    username: "johndoe",
  },
  // ... add more mock users if needed
];

const resolvers = {
  Query: {
    node: (_, { id }) => {
      const { type, localId } = fromGlobalId(id);
      if (type === "User") {
        return users.find((user) => user.id === localId);
      }
    },
    nodes: (_, { ids }) => {
      return users.filter((user) => {
        const { type, localId } = fromGlobalId(id);
        if (type === "User") {
          return users.find((user) => user.id === localId);
        }
        return null;
      });
    },
    userById: (_, { id }) => users.find((user) => user.id === id),
    userByUsername: (_, { username }) =>
      users.find((user) => user.username === username),
    users: (_, args) => {
      return {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
        edges: users.map((user) => ({
          cursor: user.id,
          node: user,
        })),
        nodes: users,
      };
    },
  },
  User: {
    id: (_) => toGlobalId("User", _.id),
  },
  Node: {
    __resolveType: object => object.__typename
  },
  DateTime: {
    // Placeholder for DateTime, you can implement custom parsing and serialization here
  },
};

function toGlobalId(type, localId) {
  return Buffer.from([type, localId].join(":")).toString("base64");
}

function fromGlobalId(globalId) {
  const [type, localId] = Buffer.from(globalId, "base64")
    .toString("utf-8")
    .split(":");
  return { type, localId };
}

const graphQLServer = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  logging: false,
});

const app = express();

app.use(
  "/graphql",

  // for `cdn` hosted version
  bcpMiddleware({ mode: "cdn" }),

  // for `self` hosted version
  // bcpMiddleware({ mode: "self" }),

  graphQLServer
);

app.listen(3000, () => {
  console.log(`GraphQL on http://localhost:3000/graphql`);
});
