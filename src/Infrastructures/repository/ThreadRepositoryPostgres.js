const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread, owner) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const now = new Date();
    const date = now.toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getCommentByThreadId(threadId) {
    const commentsQuery = {
      text: `SELECT comments.*, users.username 
            FROM comments LEFT JOIN users ON users.id = comments.owner
            WHERE comments.thread_id = $1 
            ORDER BY date ASC`,
      values: [threadId],
    };
    const resComments = await this._pool.query(commentsQuery);
    return resComments.rows;
  }

  async getReplyByThreadId(threadId) {
    const repliesQuery = {
      text: `SELECT replies.*, users.username 
          FROM replies LEFT JOIN users ON users.id = replies.owner
          WHERE replies.thread_id = $1 
          ORDER BY date ASC`,
      values: [threadId],
    };
    const resReplies = await this._pool.query(repliesQuery);
    return resReplies.rows;
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.*, users.username 
      FROM threads LEFT JOIN users ON users.id = threads.owner
      WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = ThreadRepositoryPostgres;
