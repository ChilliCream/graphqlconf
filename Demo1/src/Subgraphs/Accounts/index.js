import bcpMiddleware from "@chillicream/bananacakepop-express-middleware";

import express from "express";
import { createYoga, createSchema } from "graphql-yoga";
import fs from "fs";
import path from "path";

const typeDefs = fs.readFileSync("./schema.graphql", "utf-8");

const users = [
  {
    __typename: 'User',
    id: "1",
    displayName: "Pascal",
    birthdate: "2000-01-01T00:00:00Z",
    name: "pascal",
  },
  {
    __typename: 'User',
    id: "2",
    displayName: "Sophie",
    birthdate: "1995-05-10T00:00:00Z",
    name: "sophie95",
  },
  {
    __typename: 'User',
    id: "3",
    displayName: "Ethan",
    birthdate: "1988-12-12T00:00:00Z",
    name: "ethan88",
  },
  {
    __typename: 'User',
    id: "4",
    displayName: "Grace",
    birthdate: "2002-07-24T00:00:00Z",
    name: "graceful02",
  },
  {
    __typename: 'User',
    id: "5",
    displayName: "Aiden",
    birthdate: "1992-03-03T00:00:00Z",
    name: "aiden92",
  },
  {
    __typename: 'User',
    id: "6",
    displayName: "Chloe",
    birthdate: "1998-08-15T00:00:00Z",
    name: "chloe_98",
  },
  {
    __typename: 'User',
    id: "7",
    displayName: "Dylan",
    birthdate: "1990-10-05T00:00:00Z",
    name: "dylan_rock",
  },
  {
    __typename: 'User',
    id: "8",
    displayName: "Olivia",
    birthdate: "2004-02-29T00:00:00Z",
    name: "olive04",
  }
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
      const idValues = ids.map((id) => fromGlobalId(id));
    
      return users.filter(user => {
        return idValues.some(idValue => 
          idValue.type === "User" && user.id === idValue.localId
        );
      });
    },
    userById: (_, { id }) => users.find((user) => user.id === id),
    userByName: (_, { name }) =>
      users.find((user) => user.name === name),
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
