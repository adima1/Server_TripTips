import request from 'supertest';
import app from '../index.js';

// שמירת אובייקט השרת
let server;

before((done) => {
  server = app.listen(done); // הפעל את השרת לפני הבדיקות
});

describe("API routes", () => {
  it('should return pong with team number from /ping', (done) => {
    request(server) // השתמש באובייקט השרת
      .get('/ping')
      .expect(200)
      .expect('pong TripTips6', done);
  });
});

after((done) => {
  server.close(done); // סגור את השרת לאחר הבדיקות
});
