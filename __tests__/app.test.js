const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserServices');

const mockUser = {
  email: 'test@test.com',
  password: '12345',
};

const signUpAndLogin = async (userProps = {}) => {
  const password = userProps ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser,  ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('users test routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a new user', async  () => {
    const res = await request(app).post('/api/v1/topSecret/users').send(mockUser);
    const { email } = mockUser;
    
    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('checks if a user can sign up and log in', async () => {
    const [agent] = await signUpAndLogin();
    const temp = await agent.post('/api/v1/topSecret/users/sessions').send(mockUser);
    expect(temp.body.message).toEqual('Successfully Signed In');
  });

  afterAll(() => {
    pool.end();
  });
});
