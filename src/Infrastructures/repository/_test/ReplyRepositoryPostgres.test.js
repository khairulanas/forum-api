const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {}); // dummy dependency

    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addReply', () => {
      it('should persist new reply and return added reply correctly', async () => {
        // Arrange
        const newReply = new NewReply({ content: 'kana' });
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123' });
        const fakeIdGenerator = () => '123'; // stub!
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedReply = await replyRepositoryPostgres
          .addReply(newReply, 'thread-123', 'comment-123', 'user-123');

        // Assert
        const reply = await RepliesTableTestHelper.getReplyById('reply-123');
        expect(addedReply).toStrictEqual(new AddedReply({
          id: 'reply-123',
          content: 'kana',
          owner: 'user-123',
        }));
        expect(reply).toHaveLength(1);
      });
      it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        const newReply = new NewReply({ content: 'kana' });
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        const fakeIdGenerator = () => '123'; // stub!
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(replyRepositoryPostgres
          .addReply(newReply, 'thread-123', 'comment-123', 'user-123'))
          .rejects.toThrowError(NotFoundError);
      });
      it('should throw NotFoundError when comment not found', async () => {
        // Arrange
        const newReply = new NewReply({ content: 'kana' });
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
        const fakeIdGenerator = () => '123'; // stub!
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(replyRepositoryPostgres
          .addReply(newReply, 'thread-123', 'comment-123', 'user-123'))
          .rejects.toThrowError(NotFoundError);
      });
    });

    describe('verifyReplyAccess', () => {
      it('should throw NotFoundError when reply not found', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(replyRepositoryPostgres.verifyReplyAccess('reply-123', 'user-123'))
          .rejects
          .toThrowError(NotFoundError);
      });

      it('should throw AuthorizationError when credentialId not match owner column', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        await RepliesTableTestHelper.addReply({
          id: 'reply-123',
          threadId: 'thread-123',
          commentId: 'comment-123',
          owner: 'user-123',
        });
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(replyRepositoryPostgres.verifyReplyAccess('reply-123', 'user-789'))
          .rejects
          .toThrowError(AuthorizationError);
      });

      it('should not throw AuthorizationError or NotFoundError when credentialId match owner column', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        await RepliesTableTestHelper.addReply({
          id: 'reply-123',
          threadId: 'thread-123',
          commentId: 'comment-123',
          owner: 'user-123',
        });
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(replyRepositoryPostgres.verifyReplyAccess('reply-123', 'user-123'))
          .resolves.not.toThrow(NotFoundError);
        await expect(replyRepositoryPostgres.verifyReplyAccess('reply-123', 'user-123'))
          .resolves.not.toThrow(AuthorizationError);
      });
    });

    describe('deleteReplyByReplyId', () => {
      it('should throw NotFoundError when reply not found', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(replyRepositoryPostgres.deleteReplyByReplyId('reply-123'))
          .rejects
          .toThrowError(NotFoundError);
      });

      it('should return success and update is_delete column correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        await RepliesTableTestHelper.addReply({
          id: 'reply-123',
          threadId: 'thread-123',
          commentId: 'comment-123',
          owner: 'user-123',
        });
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // Action
        const result = await replyRepositoryPostgres.deleteReplyByReplyId('reply-123');

        // Assert
        const reply = await RepliesTableTestHelper.getReplyById('reply-123');
        expect(result.status).toEqual('success');
        expect(reply[0].id).toEqual('reply-123');
        expect(reply[0].is_delete).toEqual(true);
      });
    });
  });
});
