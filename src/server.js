import { ApolloServer, PubSub } from "apollo-server";
import modules from "./modules";
import { customLogPlugin, serverClosePlugin } from "./services/gqlPlugin";

import { getUserFromToken } from "./services/auth";

function startServer({ port = process.env.PORT } = {}) {
  const server = new ApolloServer({
    modules,
    async context({ connection, req }) {
      if (connection) {
        return { ...connection.context };
      }
      const token = req.headers.authorization;
      const user = await getUserFromToken(token);
      console.log("user ctx", user);
      return { user };
    },
    subscriptions: {
      async onConnect(params) {
        const token = params.authToken;
        const user = await getUserFromToken(token);

        if (!user) {
          throw new Error("nope");
        }
        // subscription return gets merged with the context object
        return { user };
      },
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
