import { gql } from "apollo-server-express";
import Event from "../../models/Event";
import mongoose from "mongoose";

const typeDefs = gql`
  type Event {
    _id: ID!
    name: String!
    date: String! @formatDate
    admin: User
    members: [User!]
    createdAt: String! @formatDate
    komyuniti: Komyuniti
    address: String
  }

  input GetEventInput {
    id: String!
  }

  input CreateEventInput {
    name: String!
    date: String!
    komyunitiId: String
  }

  input UpdateEventInput {
    id: String!
    name: String!
    date: String
    address: String
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
    event(input: GetEventInput!): Event @auth
    events(userId: String, komyunitiId: String): [Event] @auth
  }

  extend type Mutation {
    createEvent(input: CreateEventInput!): Event @auth
    updateEvent(input: UpdateEventInput): Event @auth
    #deleteEvent(input: DeleteEventInput): Event @auth
    addEventMember(input: AddEventMemberInput): Event @auth
    #deleteEventMember(input: DeleteEventMemberInput): Event @auth
  }
`;

const resolvers = {
  Query: {
    async events(_, { userId, komyunitiId }) {
      // find by optional given userId
      if (userId !== undefined && komyunitiId === undefined) {
        const id = mongoose.Types.ObjectId(userId);
        return await Event.find({ members: { $elemMatch: { $eq: id } } });
      }

      // find by optional given komyunitiId
      else if (userId === undefined && komyunitiId !== undefined) {
        const id = mongoose.Types.ObjectId(komyunitiId);
        return await Event.find({ komyuniti: { $eq: id } });
      }

      // find by both
      else if (userId !== undefined && komyunitiId !== undefined) {
        const userId = mongoose.Types.ObjectId(userId);
        const komyunitiId = mongoose.Types.ObjectId(komyunitiId);
        return await Event.find({
          komyuniti: { $eq: komyunitiId },
          members: { $elemMatch: { $eq: userId } },
        });
      }

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
    async createEvent(_, { input }, { user }) {
      const { komyunitiId, date, name } = input;
      const eventCreateObj = {
        komyuniti: komyunitiId !== undefined ? komyunitiId : null,
        date: new Date(date),
        name: name,
        createdAt: new Date(),
        admin: user._id,
        members: [user._id],
      };
      const event = await Event.create(eventCreateObj);

      return event;
    },
    async updateEvent(_, { input }, { user }) {
      const { id } = input;
      const event = await Event.findById(id);

      if (!event) {
        throw new Error(`Event not found with id of ${id}`);
      }

      // TODO: check if user is member

      event.name = input.name || event.name;
      event.date = input.date || event.date;
      event.address = input.address || event.address;

      const updatedEvent = await event.save();

      return updatedEvent;
    },
    async addEventMember(_, { input }, __) {
      const { id, userId } = input;

      const event = await Event.findById(id);

      if (!event) {
        throw new Error(`Event not found with id of ${id}`);
      }

      // only add member if not already is member
      const members = event.members.map((m) => m._id.toString());
      for (let memberId of members) {
        if (!event.members.includes(memberId)) {
          event.members.push(mongoose.Types.ObjectId(memberId));
        }
      }

      event.members.push(userId);
      const _event = await event.save();

      return _event;
    },
  },
};

const event = { typeDefs, resolvers };
export default event;
