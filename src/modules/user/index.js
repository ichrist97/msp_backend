import path from "path";
import { createWriteStream } from "fs";
import { gql } from "apollo-server-express";
import User from "../../models/User";
import {
  GraphQLUpload, // The GraphQL "Upload" Scalar
} from "graphql-upload";

const typeDefs = gql`
  scalar Upload

  type User {
    _id: ID! @log
    email: String!
    name: String!
    createdAt: String! @formatDate
    role: Role!
    friends: [User!]
    image: String
    imageUrl: String
    publicKeys: [String!]
  }

  type UserImageUpload {
    success: Boolean!
    user: User!
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
  input UserImageUploadInput {
    file: Upload!
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
    uploadUserImage(input: UserImageUploadInput!): UserImageUpload @auth
    addPublicKey(key: String!): User @auth
  }
`;

const resolvers = {
  // Add this line to use the `GraphQLUpload` from `graphql-upload`.
  Upload: GraphQLUpload,

  Query: {
    async users(_, __, { user }) {
      return await User.find({});
    },
    async user(_, { input }, { user }) {
      const { id } = input;
      const _user = await User.findById(id).catch(() => {
        throw new Error("Incorrect ObjectId provided");
      });
      if (!_user) {
        throw new Error("User is not existing");
      }
      return _user;
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
        throw new Error("User does not exist");
      });

      // only add if not already friend
      const friends = user.friends.map((m) => m._id.toString());
      for (let friendId of friends) {
        if (!user.friends.includes(friendId)) {
          user.friends.push(mongoose.Types.ObjectId(friendId));
        }
      }

      const _user = await user.save();
      return _user;
    },
    async uploadUserImage(_, { input }, { user }, __) {
      const { file } = input;
      const { createReadStream, filename, mimetype } = await file;

      // Make sure the image is a photo
      if (!mimetype.startsWith("image")) {
        throw new Error(`Please upload an image file`);
      }

      // Create custom filename
      const customFileName = `photo_${user._id}${path.parse(filename).ext}`;

      console.log("uploaded file", file);

      await new Promise((res) => {
        createReadStream().pipe(
          createWriteStream(
            path.join(__dirname, "../../../public/uploads/users", customFileName)
          ).on("close", res)
        );
      });

      // save image url to user
      const imageUrl = `${process.env.SERVER_URL}:${process.env.PORT}/uploads/users/${customFileName}`;
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          image: customFileName,
          imageUrl,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return {
        user: updatedUser,
        success: true,
      };
    },
    async addPublicKey(_, { key }, { user }) {
      let _user = await User.findById(user._id);

      // add new public key to model
      if (!_user.publicKeys.includes(key)) {
        _user.publicKeys.push(key);
        _user = await _user.save();
      }
      return _user;
    },
  },
};

const user = { typeDefs, resolvers };
export default user;
