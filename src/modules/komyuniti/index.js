import { gql } from "apollo-server-express";
import Komyuniti from "../../models/Komyuniti";

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
    userId: String!
  }

  input DeleteKomyunitiMemberInput {
    id: String!
    userId: String!
  }

  extend type Query {
    komyuniti(input: GetKomyunitiInput!): Komyuniti
    komyunities: [Komyuniti]
  }

  extend type Mutation {
    createKomyuniti(input: CreateKomyunitiInput): Komyuniti @auth
    updateKomyuniti(input: UpdateKomyunitiInput): Komyuniti @auth
    #deleteKomyuniti(input: DeleteKomyunitiInput): Komyuniti
    addKomyunitiMember(input: AddKomyunitiMemberInput): Komyuniti
    #deleteKomyunitiMember(input: DeleteKomyunitiMemberInput): Komyuniti
  }
`;

const resolvers = {
  Query: {
    async komyunities(_, __, { user }) {
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
      const createObj = { ...input, ...{ admin: user._id } };
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
        throw new Error(
          `User ${user.id} is not authorized to update this komyuniti`
        );
      }

      const updatedKomyuniti = await Komyuniti.findByIdAndUpdate(
        id,
        komyunitiUpdateObj,
        {
          new: true,
          runValidators: true,
        }
      );

      return updatedKomyuniti;
    },
    async addKomyunitiMember(_, { input }, { user }) {
      const { id, userId } = input;

      const komyuniti = await Komyuniti.findById(id);

      if (!komyuniti) {
        throw new Error(`Komyuniti not found with id of ${id}`);
      }

      komyuniti.members.push(userId);
      const _komyuniti = await komyuniti.save();

      return _komyuniti;
    },
  },
};

const komyuniti = { typeDefs, resolvers };
export default komyuniti;
