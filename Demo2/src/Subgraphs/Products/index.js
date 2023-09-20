import bcpMiddleware from "@chillicream/bananacakepop-express-middleware";

import express from "express";
import { createYoga, createSchema } from "graphql-yoga";
import fs from "fs";
import path from "path";

const typeDefs = fs.readFileSync("./schema.graphql", "utf-8");

const products = [
  {
    __typename: 'Product',
    id: "1",
    name: "Laptop Pro",
    price: 1299.99,
    weight: 1200,
    pictureFileName: "laptop_pro.jpg",
    dimension: {
      weight: 1200,
      size: 15
    },
    pictureUrl: "http://example.com/images/laptop_pro.jpg"
  },
  {
    __typename: 'Product',
    id: "2",
    name: "Smartphone XL",
    price: 799.99,
    weight: 210,
    pictureFileName: "smartphone_xl.jpg",
    dimension: {
      weight: 210,
      size: 6
    },
    pictureUrl: "http://example.com/images/smartphone_xl.jpg"
  },
  {
    __typename: 'Product',
    id: "3",
    name: "Bluetooth Speaker",
    price: 59.99,
    weight: 350,
    pictureFileName: "speaker.jpg",
    dimension: {
      weight: 350,
      size: 5
    },
    pictureUrl: "http://example.com/images/speaker.jpg"
  },
  {
    __typename: 'Product',
    id: "4",
    name: "Smartwatch G4",
    price: 249.99,
    weight: 110,
    pictureFileName: "smartwatch_g4.jpg",
    dimension: {
      weight: 110,
      size: 2
    },
    pictureUrl: "http://example.com/images/smartwatch_g4.jpg"
  },
  {
    __typename: 'Product',
    id: "5",
    name: "Wireless Earbuds",
    price: 89.99,
    weight: 50,
    pictureFileName: "earbuds.jpg",
    dimension: {
      weight: 50,
      size: 1
    },
    pictureUrl: "http://example.com/images/earbuds.jpg"
  }
];


const resolvers = {
  Query: {
    node: (_, { id }) => {
      const { type, localId } = fromGlobalId(id);
      if (type === "Product") {
        return products.find((product) => product.id === localId);
      }
    },
    nodes: (_, { ids }) => {
      const idValues = ids.map((id) => fromGlobalId(id));

      return products.filter((product) => {
        return idValues.some(
          (idValue) => idValue.type === "Product" && product.id === idValue.localId
        );
      });
    },
    productById: (_, { id }) => products.find((user) => user.id === id),
    products: (_, args) => {
      return {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
        edges: products.map((user) => ({
          cursor: user.id,
          node: user,
        })),
        nodes: products,
      };
    },
  },
  Product: {
    id: (_) => toGlobalId("Product", _.id),
  },
  Node: {
    __resolveType: (object) => object.__typename,
  },
  URL: {
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

app.listen(3020, () => {
  console.log(`GraphQL on http://localhost:3020/graphql`);
});
