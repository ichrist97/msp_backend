import { ApolloServer, PubSub } from "apollo-server";
import modules from "./modules";
// import { customLogPlugin } from "./services/gqlPlugin";

import { getUserFromToken } from "./services/auth";

function startServer({ port = process.env.PORT } = {}) {
  const server = new ApolloServer({
    modules,
    async context({ connection, req }) {
      if (connection) {
        return { ...connection.context };
      }
      // req.headers get lowercased by express
      const token = req.headers.authorization;
      const user = await getUserFromToken(token);
      // console.log("user ctx", user);
      return { user };
    },
    subscriptions: {
      async onConnect(params) {
        // params represent req.headers but do not get lowercased
        const token = params.authToken;
        const user = await getUserFromToken(token);

        // globaly shut down subscriptions -> only authed users can initiate subscriptions
        if (!user) {
          throw new Error("not authorized");
        }
        // subscription return gets merged with the context object
        return { user };
      },
    },
    // plugins: [customLogPlugin],
  });

  server.listen(port).then(({ url }) => {
    console.log(`Server ready at: ${url} 🚀 `.green.bold.underline);
  });
}
export { startServer };
