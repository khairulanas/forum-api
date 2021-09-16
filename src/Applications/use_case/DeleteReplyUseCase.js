class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {
      replyId,
      credentialId,
    } = useCasePayload;
    await this._replyRepository.verifyReplyAccess(replyId, credentialId);
    return this._replyRepository
      .deleteReplyByReplyId(replyId);
  }
}

module.exports = DeleteReplyUseCase;
