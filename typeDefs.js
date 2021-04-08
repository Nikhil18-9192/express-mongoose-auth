const { gql } = require('apollo-server-express');

module.exports = {
  typeDefs: gql`
    type Query {
      posts: [Post!]!
    }
    type Post {
      id: ID!
      title: String!
      user: String!
      description: String!
    }
    type Mutation {
      createPost(title: String!, description: String!, user: String!): Post!
    }
  `,
};
