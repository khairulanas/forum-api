const DetailThread = require('../../Domains/threads/entities/DetailThread');
const {
  mapDBToDetailThread,
  mapDBToDetailComment,
  mapDBToDetailReply,
} = require('../../Commons/utils/mapdb');

class GetDetailThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const dataThread = await this._threadRepository.getThreadById(useCasePayload);
    const dataComment = await this._threadRepository.getCommentByThreadId(useCasePayload);
    const dataReply = await this._threadRepository.getReplyByThreadId(useCasePayload);
    const dataLike = await this._threadRepository.getlikeByThreadId(useCasePayload);

    const likeCount = (commentId) => dataLike.filter((i) => i.comment_id === commentId).length;

    const replies = (commentId) => dataReply.filter((i) => i.comment_id === commentId)
      .map((j) => ({ ...j, content: j.is_delete ? '**balasan telah dihapus**' : j.content }))
      .map(mapDBToDetailReply);
    const comments = dataComment.map((i) => ({
      ...i,
      content: i.is_delete ? '**komentar telah dihapus**' : i.content,
      likeCount: likeCount(i.id),
      replies: replies(i.id),
    }))
      .map(mapDBToDetailComment);
    const thread = dataThread.map(mapDBToDetailThread)
      .map((i) => ({ ...i, comments }))[0];

    return new DetailThread({ ...thread });
  }
}

module.exports = GetDetailThreadUseCase;
