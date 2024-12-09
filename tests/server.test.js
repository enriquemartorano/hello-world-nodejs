const http = require('http');

test('Server should return welcome message', done => {
  http.get('http://localhost:3000/', res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      const response = JSON.parse(data);
      expect(response.message).toBe('Welcome to our API!');
      done();
    });
  });
});
