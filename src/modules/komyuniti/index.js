import { gql } from "apollo-server-express";
import Komyuniti from "../../models/Komyuniti";

const typeDefs = gql`
  type Komyuniti {
    _id: ID!
    name: String!
    members: [User!]
    admins: [User!]
    createdAt: String! @formatDate
  }

  input GetKomyunitiInput {
    id: String!
  }

  input CreateKomyunitiInput {
    name: String!
  }

  input UpdateKomyunitiInput {
    name: String
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
    createKomyuniti(input: CreateKomyunitiInput): Komyuniti
    #updateKomyuniti(input: UpdateKomyunitiInput): Komyuniti
    #deleteKomyuniti(input: DeleteKomyunitiInput): Komyuniti
    #addKomyunitiMember(input: AddKomyunitiMemberInput): Komyuniti
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
    async createKomyuniti(_, { input }, __) {
      const komyuniti = await Komyuniti.create(input);

      return komyuniti;
    },
  },
};

const komyuniti = { typeDefs, resolvers };
export default komyuniti;
