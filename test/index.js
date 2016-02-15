const Credstash = require('../index.js');
const should = require('chai').should();
const AWS = require('aws-sdk-mock');

describe('credstash', () => {
  afterEach(() => {
    AWS.restore();
  });

  it('can get secret', (done) => {
    AWS.mock('DynamoDB', 'query', mockQuery); 
    AWS.mock('KMS', 'decrypt', mockKMS); 
    var credstash = new Credstash();
    return credstash.get('secret', (e, secret) => {
      should.not.exist(e);
      secret.should.equal('magic');
      return done();
    });
  });
});

var mockKMS = (params, done) => {
  var ret = {
    Plaintext: new Buffer('KvQ7FPrc2uYXHjW8n+Y63HHCvyRjujeaIZepV/eUkfkz8ZbM9oymmzC69+XLTlbtvRV1MNmo3ngqE+7dJHoDMw==', 'base64')
  }
  
  return done(null, ret);
};

var mockQuery = (params, done) => {
  var ret = {
    Items: [{
      key: {
        S: 'CiBzvX0zBm6hGu0EnbpRJ+eO+HfPOIsG5oq1UDiK+pi/vBLLAQEBAQB4c719MwZuoRrtBJ26USfnjvh3zziLBuaKtVA4ivqYv7wAAACiMIGfBgkqhkiG9w0BBwaggZEwgY4CAQAwgYgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMKNQYv5K9wPp+EvLQAgEQgFsITbvzf75MiY6aeIG2v/OzH2ThW5EJrfgNSekCGXONJSs3R8qkOlxFOfnoISvCXylMwBr+iAZFydgZiSyudPE+qocnYi++aVsv+iV9rR7o+FGQtSWKj2UH9PHm'
      },
      hmac: {
        S: 'ada335c27410033b16887d083aba629c17ad8f88b7982f331e4f6f8df92c41a9'
      },
      contents: {
        S: 'H2T+k+c='
      }
    }]
  };

  return done(null, ret);
};
