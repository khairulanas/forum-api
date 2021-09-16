const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'dicoding',
      body: 'secret',
      date: '2021-08-08T07:19:09.775Z',
      username: 'kana-123',
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          replies: [{
            id: 'reply-BErOXUSefjwWGW1Z10Ihk',
            content: '**balasan telah dihapus**',
            date: '2021-08-08T07:59:48.766Z',
            username: 'johndoe',
          },
          {
            id: 'reply-xNBtm9HPR-492AeiimpfN',
            content: 'sebuah balasan',
            date: '2021-08-08T08:07:01.522Z',
            username: 'dicoding',
          }],
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
          replies: [],
        },
      ],
    });

    const expectedThreads = [{
      id: 'thread-123',
      title: 'dicoding',
      body: 'secret',
      date: '2021-08-08T07:19:09.775Z',
      username: 'kana-123',
    }];
    const expectedComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'sebuah comment',
        is_delete: true,
      },
    ];
    const expectedReplies = [{
      id: 'reply-BErOXUSefjwWGW1Z10Ihk',
      content: 'sebuah balasan',
      date: '2021-08-08T07:59:48.766Z',
      username: 'johndoe',
      comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
      is_delete: true,
    },
    {
      id: 'reply-xNBtm9HPR-492AeiimpfN',
      content: 'sebuah balasan',
      date: '2021-08-08T08:07:01.522Z',
      username: 'dicoding',
      comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
      is_delete: false,
    }];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreads));
    mockThreadRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockThreadRepository.getReplyByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));

    /** creating use case instance */
    const detailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const detailThread = await detailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.getCommentByThreadId).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.getReplyByThreadId).toBeCalledWith(useCasePayload);
  });
});
