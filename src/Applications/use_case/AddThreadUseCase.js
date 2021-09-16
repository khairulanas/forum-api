const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread({ title: useCasePayload.title, body: useCasePayload.body });
    return this._threadRepository.addThread(newThread, useCasePayload.owner);
  }
}

module.exports = AddThreadUseCase;
