import { gql } from "apollo-server-express";
import Komyuniti from "../../models/Komyuniti";
import mongoose from "mongoose";

const typeDefs = gql`
  type Komyuniti {
    _id: ID!
    name: String!
    members: [User!]
    admin: User
    createdAt: String! @formatDate
  }

  input GetKomyunitiInput {
    id: String!
  }

  input CreateKomyunitiInput {
    name: String!
    userIds: [String!]
  }

  input UpdateKomyunitiInput {
    id: String!
    name: String!
  }

  input DeleteKomyunitiInput {
    id: String!
  }

  input AddKomyunitiMemberInput {
    id: String!
    userIds: [String!]!
  }

  input DeleteKomyunitiMemberInput {
    id: String!
    userId: String!
  }

  extend type Query {
    komyuniti(input: GetKomyunitiInput!): Komyuniti
    komyunities(userId: String): [Komyuniti]
  }

  extend type Mutation {
    createKomyuniti(input: CreateKomyunitiInput!): Komyuniti @auth
    updateKomyuniti(input: UpdateKomyunitiInput!): Komyuniti @auth
    deleteKomyuniti(input: DeleteKomyunitiInput!): Komyuniti @auth
    addKomyunitiMember(input: AddKomyunitiMemberInput!): Komyuniti
    #deleteKomyunitiMember(input: DeleteKomyunitiMemberInput): Komyuniti
  }
`;

const resolvers = {
  Query: {
    async komyunities(_, { userId }) {
      // find by optional given userId
      if (userId !== undefined) {
        const id = mongoose.Types.ObjectId(userId);
        return await Komyuniti.find({ members: { $elemMatch: { $eq: id } } });
      }

      return await Komyuniti.find({});
    },
    async komyuniti(_, { input }, { user }) {
      const { id } = input;
      const komyuniti = await Komyuniti.findById(id).catch(() => {
        throw new Error("Incorrect ObjectId provided");
      });
      if (!komyuniti) {
        throw new Error("Komyuniti is not existing");
      }
      return komyuniti;
    },
  },
  Mutation: {
    async createKomyuniti(_, { input }, { user }) {
      const { name, userIds } = input;
      // add optional members beside admin
      let members = [user._id];
      if (userIds !== undefined) {
        const userObjIds = userIds.map((id) => mongoose.Types.ObjectId(id));
        members = [...members, ...userObjIds];
      }

      const createObj = { name: name, members: members, admin: user._id };
      const komyuniti = await Komyuniti.create(createObj);

      return komyuniti;
    },
    async updateKomyuniti(_, { input }, { user }) {
      const { id, name } = input;
      const komyunitiUpdateObj = {
        name,
      };
      const komyuniti = await Komyuniti.findById(id);

      if (!komyuniti) {
        throw new Error(`Komyuniti not found with id of ${id}`);
      }

      // Make sure user is komyuniti owner
      if (komyuniti.admin != user._id.toString()) {
        throw new Error(`User ${user.id} is not authorized to update this komyuniti`);
      }

      const updatedKomyuniti = await Komyuniti.findByIdAndUpdate(id, komyunitiUpdateObj, {
        new: true,
        runValidators: true,
      });

      return updatedKomyuniti;
    },
    async addKomyunitiMember(_, { input }, { user }) {
      const { id, userIds } = input;

      const komyuniti = await Komyuniti.findById(id);

      if (!komyuniti) {
        throw new Error(`Komyuniti not found with id of ${id}`);
      }

      const members = komyuniti.members.map((m) => m._id.toString());
      for (let userId of userIds) {
        if (!members.includes(userId)) {
          komyuniti.members.push(mongoose.Types.ObjectId(userId));
        }
      }

      const _komyuniti = await komyuniti.save();

      return _komyuniti;
    },
    async deleteKomyuniti(_, { input }, { user }) {
      const { id } = input;

      const komyuniti = await Komyuniti.findById(id);

      if (!komyuniti) {
        throw Error(`No Komyuniti with the id of ${id}`);
      }

      // Make sure user is komyuniti owner
      if (komyuniti.admin != user._id.toString()) {
        throw new Error(`User ${user.id} is not authorized to delete this komyuniti`);
      }

      const removedKomyuniti = await komyuniti.remove();
      return removedKomyuniti;
    },
  },
};

const komyuniti = { typeDefs, resolvers };
export default komyuniti;
