import { gql, PubSub, withFilter } from "apollo-server-express";
import ChatMessage from "../../models/Chat";
import Event from "../../models/Event";

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
    createChatMsg(input: CreateMsgInput!): ChatMsg @auth
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
      pubSub.publish(TOPIC, { msgCreated: msg });

      return msg;
    },
  },
  Subscription: {
    msgCreated: {
      subscribe: withFilter(
        () => pubSub.asyncIterator(TOPIC),
        (payload, variables, context) => {
          // check if user is member of event
          /*
          const event = await Event.findById(payload.msg.event._id.toString());
          if (!event.members.includes(context.user._id)) {
            return false;
          }
          */

          // filter by eventId
          const correctEvent = payload.msgCreated.event._id.toString() === variables.eventId;
          // dont get subscription event for own messages
          const notOwnMsg = payload.msgCreated.user._id !== context.user._id;

          return correctEvent && notOwnMsg;
        }
      ),
    },
  },
};

const chat = { typeDefs, resolvers };
export default chat;
