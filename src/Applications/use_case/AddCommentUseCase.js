const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment({ content: useCasePayload.content });
    return this._commentRepository
      .addComment(newComment, useCasePayload.threadId, useCasePayload.owner);
  }
}

module.exports = AddCommentUseCase;
