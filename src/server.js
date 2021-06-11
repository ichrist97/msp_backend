import { ApolloServer } from "apollo-server";
import modules from "./modules";
import typeDefs from "./typedefs";
import resolvers from "./resolvers";
import { customLogPlugin, serverClosePlugin } from "./services/gqlPlugin";

import { getUserFromToken } from "./services/auth";
import { Token } from "graphql";

// import { createToken, getUserFromToken } from "./auth";

function startServer({ port = process.env.PORT } = {}) {
  const server = new ApolloServer({
    modules,
    context({ req }) {
      const token = req.headers.authorization;
      const user = getUserFromToken(token);
      return { user };
    },
    // typeDefs,
    // resolvers,
    // plugins: [customLogPlugin],
    // context({ req }) {
    //   const token = req.headers.authorization;
    //   const user = getUserFromToken(token);
    //   return { ...db, user, createToken };
    // },
  });

  server.listen(port).then(({ url }) => {
    console.log(`Server ready at: ${url} 🚀 `.green.bold.underline);
  });
}
export { startServer };
