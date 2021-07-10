import path from "path";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { typeDefs, resolvers } from "./modules";
import express from "express";
import logger from "morgan";
import {
  graphqlUploadExpress, // The Express middleware.
} from "graphql-upload";
import http from "http";

import { getUserFromToken } from "./services/auth";

// import directive visitor classes
import {
  LogDirective,
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective,
  RestDirective,
} from "./directives/visitors";

function startServer({ port = process.env.PORT } = {}) {
  const apolloServer = new ApolloServer({
    schemaDirectives: {
      log: LogDirective,
      formatDate: FormatDateDirective,
      auth: AuthenticationDirective,
      authorization: AuthorizationDirective,
      rest: RestDirective,
    },
    typeDefs,
    resolvers,
    // Disable the built in file upload implementation that uses an outdated
    // `graphql-upload` version, see:
    // https://github.com/apollographql/apollo-server/issues/3508#issuecomment-662371289
    uploads: false,
    async context({ connection, req }) {
      if (connection) {
        return { ...connection.context };
      }
      // req.headers get lowercased by express
      const token = req.headers.authorization;
      const user = await getUserFromToken(token);

      return { user };
    },
    subscriptions: {
      async onConnect(params) {
        // params represent req.headers but do not get lowercased
        const token = params.Authorization;
        const user = await getUserFromToken(token);

        // globaly shut down subscriptions -> only authed users can initiate subscriptions
        if (!user) {
          throw new AuthenticationError("Not authorized!");
        }
        // subscription return gets merged with the context object
        return { user };
      },
    },
  });

  // init express app
  const app = express();

  // express middlewares
  app.use(logger("dev"));
  app.use(graphqlUploadExpress());
  app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
  apolloServer.applyMiddleware({ app });

  // activate subscriptions in apollo
  const server = http.createServer(app);
  apolloServer.installSubscriptionHandlers(server);

  // start server
  server.listen(port, () => {
    console.log(`🚀  Server ready at http://localhost:${port}/graphql`);
  });
}
export { startServer };
