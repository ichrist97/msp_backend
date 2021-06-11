import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    category(id: ID!): Category
    categorys: [Category]
  }

  extend type Product {
    category: Category
  }

  type Category {
    id: ID!
    name: String!
    products: [Product]
  }
`;

const resolvers = {
  Query: {
    category(_, { id }) {
      return {
        id,
        name: "Homeware",
        products: [
          {
            id: 1,
            name: "lamp",
            price: 10000,
          },
          {
            id: 2,
            name: "sofa",
            price: 20000,
          },
        ],
      };
    },
    categorys() {
      return [
        {
          id: 1,
          name: "Homeware",
          products: [
            {
              id: 1,
              name: "lamp",
              price: 10000,
            },
            {
              id: 2,
              name: "sofa",
              price: 20000,
            },
          ],
        },
        {
          id: 2,
          name: "kitchen",
          products: [
            {
              id: 1,
              name: "oven",
              price: 10000,
            },
            {
              id: 2,
              name: "toaster",
              price: 20000,
            },
          ],
        },
      ];
    },
  },

  Product: {
    category(parent, arg, ctx, info) {
      console.log("parent", parent);
      return {
        id: 1,
        name: "Homeware",
      };
    },
  },
};

export default { typeDefs, resolvers };
