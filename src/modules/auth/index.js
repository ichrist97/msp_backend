import { gql } from "apollo-server";
import User from "../../models/User";
import { authenticated } from "../../services/auth";

const typeDefs = gql`
  type AuthUser {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    role: Role!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    currentUser: User!
  }

  type Mutation {
    register(input: RegisterInput!): AuthUser!
    login(input: LoginInput!): AuthUser!
  }
`;

const resolvers = {
  Query: {
    currentUser: authenticated((_, __, { user }) => {
      const { _id, role, name, email, createdAt } = user;
      return { id: _id, role, name, email, createdAt };
    }),
  },
  Mutation: {
    async register(_, { input }) {
      const { name, email, password, role } = input;
      const existing = await User.findOne({ email });

      if (existing) {
        throw new Error("nope");
      }

      const user = await User.create({
        name,
        email,
        password,
        role,
      });

      const token = user.getSignedToken();

      return { token, user };
    },

    async login(_, { input }) {
      const { email, password } = input;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        throw new Error("wrong email and password");
      }

      const passwordMatch = await user.matchPassword(password);

      if (!passwordMatch) {
        throw new Error("wrong email and password");
      }

      const token = user.getSignedToken();
      return { token, user };
    },
  },
};

const auth = {
  typeDefs,
  resolvers,
};

export default auth;
