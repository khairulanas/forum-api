const CommentHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'comments',
  register: async (server, { injections }) => {
    const commentHandler = new CommentHandler(injections);
    server.route(routes(commentHandler));
  },
};
