// const { authenticated, authorized } = require("./auth");
import User from "../models/User";
import Post from "../models/Post";

/**
 * Anything Query / Mutation resolver
 * using a user for a DB query
 * requires user authenication
 */
export default {
  Query: {
    async post() {
      console.log(await Post.find());
      return { name: "dghsg" };
    },
    me(_, __, { user }) {
      return { id: "dshgashgf", email: "testuser@gmail.com" };
    },
  },
  Mutation: {
    async createPost(_, { name }) {
      console.log("name", name);
      const post = await Post.create({ name });

      return post;
    },
  },
};
