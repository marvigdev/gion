import supertest from 'supertest';
import createTestDatabase, {
  TestDatabase,
} from '../../helpers/createTestDatabase';
import app from '../../app';
import { PostI } from '../../models/Post';
import PostService from '../../services/PostService';

const client = supertest(app.callback());
let database: TestDatabase;

beforeAll(async () => {
  database = await createTestDatabase();
  await database.connect();
});

afterAll(async () => {
  await database.close();
});

describe('GET /posts/:postId', () => {
  let post: PostI;

  beforeAll(async () => {
    post = await PostService.create({ content: 'Hello!' });
  });

  test('returns 404 when no post was found with given id', async () => {
    const request = await client.get('/posts/123');

    expect(request.statusCode).toEqual(404);
    expect(request.body.errorCode).toEqual('POST/NOT_FOUND');
  });

  test('returns post correctly', async () => {
    const request = await client.get(`/posts/${post.identifier}`);

    expect(request.statusCode).toEqual(200);
    expect(request.body).toEqual({
      identifier: expect.any(String),
      title: expect.any(String),
      content: expect.any(String),
    });
  });
});
