const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('LikeRepositoryPostgres', () => {
  it('should be instance of LikeRepository domain', () => {
    const likeRepositoryPostgres = new LikeRepositoryPostgres({}, {}); // dummy dependency

    expect(likeRepositoryPostgres).toBeInstanceOf(LikeRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await LikesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addLike', () => {
      it('should persist add like and return cusccess correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123' });
        const fakeIdGenerator = () => '123'; // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedLike = await likeRepositoryPostgres
          .addLike('thread-123', 'comment-123', 'user-123');

        // Assert
        expect(addedLike.status).toStrictEqual('success');
      });
      it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        const fakeIdGenerator = () => '123'; // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(likeRepositoryPostgres
          .addLike('thread-123', 'comment-123', 'user-123'))
          .rejects.toThrowError(NotFoundError);
      });
      it('should throw NotFoundError when comment not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
        const fakeIdGenerator = () => '123'; // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(likeRepositoryPostgres
          .addLike('thread-123', 'comment-123', 'user-123'))
          .rejects.toThrowError(NotFoundError);
      });
    });

    describe('removeLike', () => {
      it('should persist remove like and return cusccess correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123' });
        await LikesTableTestHelper.addLike({ id: 'like-123' });
        const fakeIdGenerator = () => '123'; // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const removedLike = await likeRepositoryPostgres
          .removeLike('like-123');

        // Assert
        expect(removedLike.status).toStrictEqual('success');
      });
    });

    describe('getLikeDetail', () => {
      it('should return array of detail like when found like', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123' });
        await LikesTableTestHelper.addLike({ id: 'like-123' });
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        // Action
        const likeDetails = await likeRepositoryPostgres
          .getLikeDetail('thread-123', 'comment-123', 'user-123');

        // Assert
        expect(likeDetails).toHaveLength(1);
      });
    });
  });
});
