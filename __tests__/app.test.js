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
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('users test routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST creates a new user', async () => {
    const res = await request(app)
      .post('/api/v1/topSecret/users')
      .send(mockUser);
    const { email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('POST checks if a user can sign up and log in', async () => {
    const [agent] = await signUpAndLogin();
    const temp = await agent
      .post('/api/v1/topSecret/users/sessions')
      .send(mockUser);
    expect(temp.body.message).toEqual('Successfully Signed In');
  });

  it('DELETE tests if a user can log out', async () => {
    const [agent] = await signUpAndLogin();
    const resp = await agent
      .post('/api/v1/topSecret/users/sessions')
      .send(mockUser);
    expect(resp.body.message).toEqual('Successfully Signed In');

    const respTwo = await agent.delete('/api/v1/topSecret/users/sessions');
    expect(respTwo.body.message).toEqual('You have signed out');
  });

  it.only('GET tests if ONLY logged in users can view the secrets', async () => {
    const resp = await request(app).get('/api/v1/topSecret/secrets/');
    expect(resp.status).toBe(401);
    expect(resp.body.message).toEqual(
      'Please sign in before attempting to continue. Your attempt has been reported to the Administrator'
    );
    const [agent] = await signUpAndLogin();
    const temp = await agent
      .post('/api/v1/topSecret/users/sessions')
      .send(mockUser);
    expect(temp.body.message).toEqual('Successfully Signed In');
    const respTwo = await agent.get('/api/v1/topSecret/secrets/');
    expect(respTwo.status).toBe(200);
    expect(respTwo.body).toMatchInlineSnapshot(`
      Array [
        Object {
          "created_at": "2022-11-30T17:56:05.945Z",
          "description": "Declared when the cafeteria has run out of salsbury steak",
          "id": "1",
          "title": "The Chair is Against the Wall",
        },
        Object {
          "created_at": "2022-11-30T17:56:05.945Z",
          "description": "After the year 2019 all birds have been replaced by government survellience drones",
          "id": "2",
          "title": "Birds are not real",
        },
      ]
    `);
  });

  afterAll(() => {
    pool.end();
  });
});
