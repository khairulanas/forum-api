const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      credentialId: 'user-123',
    };
    const expectedDeletedReply = {
      status: 'success',
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.verifyReplyAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyByReplyId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDeletedReply));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    const deletedReply = await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(deletedReply).toStrictEqual(expectedDeletedReply);
    expect(mockReplyRepository.verifyReplyAccess).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.credentialId,
    );
    expect(mockReplyRepository.deleteReplyByReplyId).toBeCalledWith(
      useCasePayload.replyId,
    );
  });
});
