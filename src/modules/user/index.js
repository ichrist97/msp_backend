import { gql } from "apollo-server";
import User from "../../models/User";

const typeDefs = gql`
  type User {
    _id: ID! @log
    email: String!
    name: String!
    createdAt: String! @formatDate
    role: Role!
    friends: [User!]
  }

  enum Role {
    ADMIN
    MEMBER
    GUEST
  }

  input UpdateUserInput {
    email: String
    name: String
    role: String
    password: String
  }

  input GetUserInput {
    id: String
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    role: Role!
  }

  input DeleteUserInput {
    id: String
  }

  input AddFriendInput {
    userId: String
  }

  extend type Query {
    users: [User!]! @auth
    user(input: GetUserInput): User! @auth
  }

  extend type Mutation {
    updateUser(input: UpdateUserInput!): User @auth @authorization(role: MEMBER)
    createUser(input: CreateUserInput!): User
    deleteUser(input: DeleteUserInput!): User
    addFriend(input: AddFriendInput!): User @auth
  }
`;

const resolvers = {
  Query: {
    async users(_, __, { user }) {
      return await User.find({});
    },
    async user(_, { input }, { user }) {
      const { id } = input;
      return await User.findById(id);
    },
  },
  Mutation: {
    async updateUser(_, { input }, { user }, info) {
      const _user = await User.findById(user._id);

      if (_user) {
        _user.name = input.name || _user.name;
        _user.email = input.email || _user.email;
        _user.role = input.role || _user.role;
        if (input.password) {
          _user.password = input.password;
        }

        const updatedUser = await _user.save();
        // const formatedUser = updatedUser.format();

        return updatedUser;
      } else {
        throw Error("user not found");
      }
    },
    async createUser(_, { input }, __) {
      const _user = await User.create(input);

      return _user;
    },

    async deleteUser(_, { input }, __) {
      const { id } = input;

      const user = await User.findById(id);

      if (!user) {
        throw Error(`No user with the id of ${id}`);
      }
      const removedUser = await user.remove();
      return removedUser;
    },

    async addFriend(_, { input }, { user }, __) {
      const { userId } = input;

      // check if user exists
      await User.findById(userId).catch(() => {
        throw new Error("User does not exist")
      })

      user.friends.push(userId);
      const _user = await user.save();
      return _user;
    },
  },
};

const user = { typeDefs, resolvers };
export default user;
