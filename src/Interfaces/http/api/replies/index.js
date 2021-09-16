const ReplyHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'replies',
  register: async (server, { injections }) => {
    const replyHandler = new ReplyHandler(injections);
    server.route(routes(replyHandler));
  },
};
