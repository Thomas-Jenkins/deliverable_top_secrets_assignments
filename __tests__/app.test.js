const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'test@test.com',
  password: '12345',
};

describe('users test routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a new user', async  () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;
    
    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  afterAll(() => {
    pool.end();
  });
});
