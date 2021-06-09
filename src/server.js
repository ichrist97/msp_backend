import { ApolloServer } from "apollo-server";
import typeDefs from "./typedefs";
import resolvers from "./resolvers";
import logger from "loglevel";
// import { createToken, getUserFromToken } from "./auth";

function startServer({ port = process.env.PORT } = {}) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context({ req }) {
    //   const token = req.headers.authorization;
    //   const user = getUserFromToken(token);
    //   return { ...db, user, createToken };
    // },
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

export { startServer };
