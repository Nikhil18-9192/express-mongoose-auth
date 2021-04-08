const Post = require('./models/Post');
module.exports = {
  resolvers: {
    Query: {
      posts: () => Post.find(),
    },
    Mutation: {
      createPost: async (_, { title, description, user }) => {
        const res = new Post({ title, description, user });
        await res.save();
        return res;
      },
    },
  },
};
