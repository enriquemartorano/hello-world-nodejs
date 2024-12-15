const request = require('supertest');
const app = require('./server'); // Assuming server.js exports app

describe('GET /', () => {
  it('should return Welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Welcome');
  });
});
