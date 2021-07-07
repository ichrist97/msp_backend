import { gql } from "apollo-server-express";
import Event from "../../models/Event";

const typeDefs = gql`
  type Event {
    _id: ID!
    name: String!
    date: String!
    admins: [User!]
    members: [User!]
    createdAt: String! @formatDate
    komyuniti: Komyuniti
    adress: String
  }

  input GetEventInput {
    id: String!
  }

  input CreateEventInput {
    name: String!
    date: String!
    komyunitiId: String!
  }

  input UpdateEventInput {
    name: String
    date: String
  }

  input DeleteEventInput {
    id: String!
  }

  input AddEventMemberInput {
    id: String!
    userId: String!
  }

  input DeleteEventMemberInput {
    id: String!
    userId: String!
  }

  extend type Query {
    event(input: GetEventInput!): Event
    events: [Event]
  }

  extend type Mutation {
    createEvent(input: CreateEventInput): Event
    #updateEvent(input: UpdateEventInput): Event
    #deleteEvent(input: DeleteEventInput): Event
    #addEventMember(input: AddEventMemberInput): Event
    #deleteEventMember(input: DeleteEventMemberInput): Event
  }
`;

const resolvers = {
  Query: {
    async events(_, __, { user }) {
      return await Event.find({});
    },
    async event(_, { input }, { user }) {
      const { id } = input;
      const event = await Event.findById(id).catch(() => {
        throw new Error("Incorrect ObjectId provided");
      });
      if (!event) {
        throw new Error("Event is not existing");
      }
      return event;
    },
  },
  Mutation: {
    async createEvent(_, { input }, __) {
      const { komyunitiId, date, name } = input;
      const eventCreateObj = {
        komyuniti: komyunitiId,
        date,
        name,
      };
      const event = await Event.create(eventCreateObj);

      return event;
    },
  },
};

const event = { typeDefs, resolvers };
export default event;
