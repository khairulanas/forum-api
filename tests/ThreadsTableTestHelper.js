/* istanbul ignore file */
const { mapDBToDetailReply, mapDBToDetailComment, mapDBToDetailThread } = require('../src/Commons/utils/mapdb');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'kana',
    body = 'hanazawa',
    date = '2021-08-08T07:59:48.766Z',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, date, owner],
    };

    await pool.query(query);
  },

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await pool.query(query);

    // get comments in thread
    const commentsQuery = {
      text: 'SELECT * FROM comments where thread_id = $1',
      values: [threadId],
    };
    const resComments = await pool.query(commentsQuery);

    // get replies in thread
    const repliesQuery = {
      text: 'SELECT * FROM replies where thread_id = $1',
      values: [threadId],
    };
    const resReplies = await pool.query(repliesQuery);

    const replies = (commentId) => resReplies.rows.filter((i) => i.comment_id === commentId)
      .map(mapDBToDetailReply);
    const comments = resComments.rows.map((i) => ({ ...i, replies: replies(i.comment_id) }))
      .map(mapDBToDetailComment);
    return result.rows.map(mapDBToDetailThread)
      .map((i) => ({ ...i, comments }));
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
