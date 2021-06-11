import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    product(id: ID!): Product
    products: [Product]
  }

  type Product {
    id: ID!
    name: String!
    price: Int!
  }
`;

const resolvers = {
  Query: {
    product(_, { id }) {
      return {
        id,
        name: "lamp",
        price: 10000,
      };
    },
    products() {
      return [
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
      ];
    },
  },
};

export default { typeDefs, resolvers };
