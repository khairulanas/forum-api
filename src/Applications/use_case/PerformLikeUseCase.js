class PerformLikeUseCase {
  constructor({ likeRepository }) {
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const {
      threadId,
      commentId,
      owner,
    } = useCasePayload;
    const likesDetail = await this._likeRepository.getLikeDetail(threadId, commentId, owner);
    if (likesDetail.length) {
      return this._likeRepository.removeLike(likesDetail[0].id);
    }
    return this._likeRepository
      .addLike(threadId, commentId, owner);
  }
}

module.exports = PerformLikeUseCase;
