import { RequestHandler } from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "type-graphql";
import { __PROD__ } from "../constants";
import { AuthResolver } from "./resolvers/auth/AuthResolver";

export const create_apollo_server = async (): Promise<RequestHandler> => {
  const schema = await buildSchema({
    resolvers: [AuthResolver],
    validate: false
  });

  // Note: Setting validate: true will require class-validator dependency
  const apollo = graphqlHTTP((req, res, _) => ({
    schema: schema,
    graphiql: !__PROD__,
    context: {
      req,
      res
    }
  }));

  return apollo;
};
