class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const {
      threadId,
      commentId,
      credentialId,
    } = useCasePayload;
    await this._commentRepository.verifyCommentAccess(commentId, credentialId);
    return this._commentRepository
      .deleteCommentByCommentId(commentId);
  }
}

module.exports = DeleteCommentUseCase;
