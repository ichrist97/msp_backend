const customLogPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  requestDidStart(requestContext) {
    //console.log("Request started! Query:\n" + requestContext.request.query);

    // console.log("request constext", requestContext);
    console.log("request constext", requestContext.schema._queryType);
    // console.log("http", requestContext.request.http.headers.host);
    console.log("http", requestContext.request.http.method);
    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      //   parsingDidStart(requestContext) {
      //     console.log("Parsing started!");
      //   },
      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      //   validationDidStart(requestContext) {
      //     console.log("Validation started!");
      //   },
    };
  },
};

export { customLogPlugin };
