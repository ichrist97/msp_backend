import { SchemaDirectiveVisitor } from "apollo-server-express";
import { defaultFieldResolver, GraphQLString } from "graphql";
import { formatDate } from "../utils";

class LogDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    field.resolve = (...args) => {
      return resolver.apply(this, args);
    };
  }
}

class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    const { format } = this.args;

    field.resolve = async (...args) => {
      // custom resolver could be async thats why await is needed
      const result = await resolver.apply(this, args);
      return formatDate(result, format);
    };

    field.type = GraphQLString;
  }
}

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;

    field.resolve = async (root, args, ctx, info) => {
      if (!ctx.user) {
        throw new Error("Not authorized !");
      }

      return resolver(root, args, ctx, info);
    };
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    const { role } = this.args;

    field.resolve = async (root, args, ctx, info) => {
      if (ctx.user.role !== role) {
        throw new Error("Wrong use role !");
      }

      return resolver(root, args, ctx, info);
    };
  }
}

class RestDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { url } = this.args;
    field.resolve = () => fetch(url);
  }
}

export {
  LogDirective,
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective,
  RestDirective,
};
