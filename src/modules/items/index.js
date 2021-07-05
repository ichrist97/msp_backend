import { gql, PubSub } from "apollo-server-express";

const pubSub = new PubSub();
const NEW_ITEM = "NEW_ITEM";

const typeDefs = gql`
  type Item {
    task: String
  }

  type Subscription {
    newItem: Item!
  }

  extend type Mutation {
    createItem(task: String!): Item
  }
`;

const resolvers = {
  Mutation: {
    createItem(_, { task }) {
      const item = { task };
      pubSub.publish(NEW_ITEM, { newItem: item });
      return item;
    },
  },
  Subscription: {
    newItem: {
      subscribe: () => pubSub.asyncIterator(NEW_ITEM),
    },
  },
};

const items = { typeDefs, resolvers };
export default items;
