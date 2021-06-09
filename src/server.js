import { ApolloServer } from "apollo-server";
import typeDefs from "./typedefs";
import resolvers from "./resolvers";
import { customLogPlugin } from "./services/gqlPlugin";
import logger from "loglevel";
// import { createToken, getUserFromToken } from "./auth";

function startServer({ port = process.env.PORT } = {}) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [customLogPlugin],
    // context({ req }) {
    //   const token = req.headers.authorization;
    //   const user = getUserFromToken(token);
    //   return { ...db, user, createToken };
    // },
  });

  server.listen(port).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

export { startServer };
