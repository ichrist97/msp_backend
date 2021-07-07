import { gql, PubSub } from "apollo-server-express";
import ChatMessage from "../../models/Chat";

const pubSub = new PubSub();
const TOPIC = "MSG_CREATED";

const typeDefs = gql`
  type ChatMsg {
    user: User!
    event: Event!
    text: String!
    createdAt: String! @formatDate
  }

  type Subscription {
    msgCreated(eventId: String!): ChatMsg
  }

  extend type Mutation {
    createChatMsg(input: CreateMsgInput!): ChatMsg
  }

  input CreateMsgInput {
    eventId: String!
    text: String!
  }
`;

const resolvers = {
  Mutation: {
    async createChatMsg(_, { input }, { user }) {
      // save in database
      const { eventId, text } = input;
      const msgCreateObj = {
        user: user._id,
        event: eventId,
        text: text,
        createdAt: new Date(),
      };
      const msg = await ChatMessage.create(msgCreateObj);

      // publish to subscription
      pubSub.publish(TOPIC, { msg: msg });

      return msg;
    },
  },
  Subscription: {
    msgCreated: {
      subscribe: () => {
        return withFilter(
          () => pubsub.asyncIterator(TOPIC),
          (payload, args) => {
            // TODO check if user is member of event

            // filter by eventId
            const correctEvent = payload.messageCreated.eventId === args.eventId;
            // dont get subscription event for own messages
            const notOwnMsg = payload.messageCreated.userId !== context.user?.id;

            return correctEvent && notOwnMsg;
          }
        );
      },
    },
  },
};

const chat = { typeDefs, resolvers };
export default chat;
