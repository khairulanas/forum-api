const LikeRepository = require('../../../Domains/likes/LikeRepository');
const PerformLikeUseCase = require('../PerformLikeUseCase');

describe('PerformLikeUseCase', () => {
  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'coment-123',
      owner: 'user-123',
    };
    const expectedAddLike = {
      status: 'success',
    };
    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockLikeRepository.getLikeDetail = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddLike));

    /** creating use case instance */
    const addLikeUseCase = new PerformLikeUseCase({
      likeRepository: mockLikeRepository,
    });

    // Action
    const addedLike = await addLikeUseCase.execute(useCasePayload);

    // Assert
    expect(addedLike).toStrictEqual(expectedAddLike);
  });

  it('should orchestrating the remove like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'coment-123',
      owner: 'user-123',
    };
    const expectedGetLikeDetail = [{
      id: 'like-123',
      thread_id: 'thread-123',
      comment_id: 'comment-123',
      owner: 'user-123',
    }];
    const expectedremovedLike = {
      status: 'success',
    };
    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockLikeRepository.getLikeDetail = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetLikeDetail));
    mockLikeRepository.removeLike = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedremovedLike));

    /** creating use case instance */
    const removeLikeUseCase = new PerformLikeUseCase({
      likeRepository: mockLikeRepository,
    });

    // Action
    const removedLike = await removeLikeUseCase.execute(useCasePayload);

    // Assert
    expect(removedLike).toStrictEqual(expectedremovedLike);
  });
});
