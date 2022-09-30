import { _agent } from 'edc-web-sdk/helpers/superagent-use';
import { JWT } from 'edc-web-sdk/requests/csrfToken';


export function getiframeEmbedURL(payload) {
  const endpoint = `${'https://nobcjvs734.execute-api.us-east-2.amazonaws.com/'}${'dev/datasets/looker_embed_url'}`;
  
  return new Promise((resolve, reject) => {
    _agent
      .post(endpoint)
      .send(payload)
      .set('jwt_token', JWT.token)
      .end((error, response) => {
        if (!error && response) {
          resolve(response.body);
        } else {
          reject(error);
        }
      });
  });
}