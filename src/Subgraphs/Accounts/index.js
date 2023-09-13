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

```javascript
const users = [
  {
    __typename: 'User',
    id: "1",
    name: "Pascal",
    birthdate: "2000-01-01T00:00:00Z",
    username: "pascal",
  },
  {
    __typename: 'User',
    id: "2",
    name: "Sophie",
    birthdate: "1995-05-10T00:00:00Z",
    username: "sophie95",
  },
  {
    __typename: 'User',
    id: "3",
    name: "Ethan",
    birthdate: "1988-12-12T00:00:00Z",
    username: "ethan88",
  },
  {
    __typename: 'User',
    id: "4",
    name: "Grace",
    birthdate: "2002-07-24T00:00:00Z",
    username: "graceful02",
  },
  {
    __typename: 'User',
    id: "5",
    name: "Aiden",
    birthdate: "1992-03-03T00:00:00Z",
    username: "aiden92",
  },
  {
    __typename: 'User',
    id: "6",
    name: "Chloe",
    birthdate: "1998-08-15T00:00:00Z",
    username: "chloe_98",
  },
  {
    __typename: 'User',
    id: "7",
    name: "Dylan",
    birthdate: "1990-10-05T00:00:00Z",
    username: "dylan_rock",
  },
  {
    __typename: 'User',
    id: "8",
    name: "Olivia",
    birthdate: "2004-02-29T00:00:00Z",
    username: "olive04",
  }
];
```

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
