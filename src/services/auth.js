import jwt from "jsonwebtoken";
import User from "../models/User";

/**
 * will attemp to verify a jwt and find a user in the
 * db associated with it. Catches any error and returns
 * a null user
 * @param {String} token jwt from client
 */
const getUserFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch (e) {
    return null;
  }
};

/**
 * checks if the user is on the context object
 * continues to the next resolver if true
 * @param {Function} next next resolver function ro run
 */
const authenticated = (next) => (root, args, context, info) => {};

/**
 * checks if the user on the context has the specified role.
 * continues to the next resolver if true
 * @param {String} role enum role to check for
 * @param {Function} next next resolver function to run
 */
const authorized = (role, next) => (root, args, context, info) => {};

export { authenticated, authorized, getUserFromToken };
