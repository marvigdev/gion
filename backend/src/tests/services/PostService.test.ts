import createTestDatabase, {
  TestDatabase,
} from '../../helpers/createTestDatabase';
import Post, { PostI } from '../../models/Post';
import PostService from '../../services/PostService';

describe('PostService.getById', () => {
  let database: TestDatabase;
  let post1: PostI;
  let post2: PostI;

  beforeAll(async () => {
    database = await createTestDatabase();
    await database.connect();

    post1 = await Post.create({ title: 'Post 1', content: 'Content 1' });
    post2 = await Post.create({ title: 'Post 2', content: 'Content 2' });
  });

  afterAll(async () => {
    await database.close();
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
