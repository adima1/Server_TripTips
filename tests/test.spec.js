import request from 'supertest';
import app from '../index.js';

describe("API routes", () => {
  it('should return pong with team number from /ping', (done) => {
    request(app) // השתמש באובייקט השרת
      .get('/ping')
      .expect(200)
      .expect('pong TripTips6', done);
  });
});

