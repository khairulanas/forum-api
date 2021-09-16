const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {
      content,
      threadId,
      commentId,
      owner,
    } = useCasePayload;
    const newReply = new NewReply({ content });
    return this._replyRepository
      .addReply(newReply, threadId, commentId, owner);
  }
}

module.exports = AddReplyUseCase;
