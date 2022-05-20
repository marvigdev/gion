import createTestDatabase, {
  TestDatabase,
} from '../../helpers/createTestDatabase';
import Post, { PostI } from '../../models/Post';
import PostService, { CreatePostProps } from '../../services/PostService';

let database: TestDatabase;

beforeAll(async () => {
  database = await createTestDatabase();
  await database.connect();
});

afterAll(async () => {
  await database.close();
});

describe('PostService.getById', () => {
  let post1: PostI;
  let post2: PostI;

  afterAll(async () => database.clear());

  beforeAll(async () => {
    post1 = await Post.create({ title: 'Post 1', content: 'Content 1' });
    post2 = await Post.create({ title: 'Post 2', content: 'Content 2' });
  });

  test('should return an empty array on empty arguments', async () => {
    const request = await PostService.getById();
    expect(request).toEqual([]);
  });

  test('should return one post correctly', async () => {
    const request = await PostService.getById(post1.identifier);
    expect(request).toHaveLength(1);

    expect(request[0].title).toEqual(post1.title);
    expect(request[0].content).toEqual(post1.content);
    expect(request[0].identifier).toEqual(post1.identifier);
  });

  test('should return multiple posts correctly', async () => {
    const request = await PostService.getById(
      post1.identifier,
      post2.identifier,
    );

    expect(request).toHaveLength(2);
  });

  test('should return only posts that matches id', async () => {
    const request = await PostService.getById(
      post2.identifier,
      'non-existing-id',
    );
    expect(request).toHaveLength(1);

    expect(request[0].title).toEqual(post2.title);
    expect(request[0].content).toEqual(post2.content);
    expect(request[0].identifier).toEqual(post2.identifier);
  });
});

describe('PostService.create', () => {
  let createdPost: PostI;

  afterAll(async () => database.clear());

  test('no post must exist before create', async () => {
    const allPosts = await Post.find({});
    expect(allPosts).toHaveLength(0);
  });

  test('post must be correctly inserted in database', async () => {
    const payload: CreatePostProps = {
      title: 'Example title',
      content: 'Example content',
    };

    createdPost = await PostService.create(payload);

    const [savedPost] = await PostService.getById(createdPost.identifier);

    expect(savedPost).not.toBeUndefined();
    expect(savedPost.title).toEqual(payload.title);
    expect(savedPost.content).toEqual(payload.content);
  });

  test('post must start with default title if none is given', async () => {
    const payload: CreatePostProps = {
      content: 'This is another content',
    };

    createdPost = await PostService.create(payload);

    // expect 2 documents to exist in this test
    const allPosts = await Post.find({});
    expect(allPosts).toHaveLength(2);

    const [savedPost] = await PostService.getById(createdPost.identifier);
    expect(savedPost.title).toEqual('Untitled post');
    expect(savedPost.content).toEqual(payload.content);
  });
});

describe('PostService.delete', () => {
  let post1: PostI;
  let post2: PostI;

  beforeAll(async () => {
    post1 = await PostService.create({ title: '1', content: '1' });
    post2 = await PostService.create({ title: '2', content: '2' });
  });

  afterAll(async () => database.clear());

  test('should return null when postId is invalid', async () => {
    const deletedPost = await PostService.delete(
      'this-post-doesnt-exist',
      'this-delete-code-neither',
    );

    expect(deletedPost).toBeNull();
  });

  test('should return null when deleteKey is incorrect', async () => {
    const deletedPost = await PostService.delete(
      post1.identifier,
      'totally-not-the-delete-code',
    );

    expect(deletedPost).toBeNull();

    const allPosts = await Post.find({});
    expect(allPosts).toHaveLength(2);
  });

  test('should delete post correctly', async () => {
    const deletedPost = await PostService.delete(
      post1.identifier,
      post1.deleteCode,
    );

    expect(deletedPost?.identifier).toBe(post1.identifier);

    const allPosts = await Post.find({});
    expect(allPosts).toHaveLength(1);

    expect(allPosts[0].identifier).toEqual(post2.identifier);
  });
});
