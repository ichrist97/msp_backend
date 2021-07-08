import { gql } from "apollo-server-express";
import User from "../../models/User";

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
    address: String
  }

  input LoginInput {
    email: String!
    password: String!
    publicKey: String
  }

  input UpdateUserDetailsInput {
    email: String
    name: String
  }

  input UpdatePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  type Query {
    currentUser: User! @auth
  }

  type Mutation {
    register(input: RegisterInput!): AuthUser!
    login(input: LoginInput!): AuthUser!
    updateDetails(input: UpdateUserDetailsInput!): User! @auth
    updatePassword(input: UpdatePasswordInput!): AuthUser! @auth
  }
`;

const resolvers = {
  Query: {
    async currentUser(_, __, { user }) {
      return await User.findById(user.id);
    },
  },
  Mutation: {
    async register(_, { input }) {
      const { name, email, password, role, address } = input;
      const existing = await User.findOne({ email });

      if (existing) {
        throw new Error("nope");
      }

      const user = await User.create({
        name,
        email,
        password,
        role,
        address,
      });

      const token = user.getSignedToken();

      return { token, user };
    },

    async login(_, { input }) {
      const { email, password } = input;

      let user = await User.findOne({ email }).select("+password");

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
    async updateDetails(_, { input }, { user }) {
      const { name, email } = input;
      const _user = await User.findById(user._id);

      if (_user) {
        _user.name = name || _user.name;
        _user.email = email || _user.email;

        const updatedUser = await _user.save();
        // const formatedUser = updatedUser.format();

        console.log("formatted user:", updatedUser);
        return updatedUser;
      } else {
        throw Error("user not found");
      }
    },
    async updatePassword(_, { input }, { user }) {
      const { currentPassword, newPassword } = input;

      // create user
      const _user = await User.findById(user.id).select("+password");

      // check current password
      if (!(await _user.matchPassword(currentPassword))) {
        throw Error("Password is incorrect");
      }

      _user.password = newPassword;
      await _user.save();

      // create token
      const token = _user.getSignedToken();
      console.log("user ...", _user);

      return { token, user: _user };
    },
  },
};

const auth = {
  typeDefs,
  resolvers,
};

export default auth;
