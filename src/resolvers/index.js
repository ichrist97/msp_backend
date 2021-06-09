// const { authenticated, authorized } = require("./auth");

/**
 * Anything Query / Mutation resolver
 * using a user for a DB query
 * requires user authenication
 */
export default {
  Query: {
    me(_, __, { user }) {
      return { id: "dshgashgf", email: "testuser@gmail.com" };
    },
  },
};
