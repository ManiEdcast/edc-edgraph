import { _agent } from 'edc-web-sdk/helpers/superagent-use';
import { JWT } from 'edc-web-sdk/requests/csrfToken';


export function getiframeEmbedURL(payload) {
  const endpoint = `${'https://nobcjvs734.execute-api.us-east-2.amazonaws.com/'}${'dev/datasets/looker_embed_url'}`;
  
  return new Promise((resolve, reject) => {
    _agent
      .post(endpoint)
      .send(payload)
      .set('jwt_token', "eyJhbGciOiJIUzI1NiJ9.eyJob3N0X25hbWUiOm51bGwsInVzZXJfaWQiOjUyNTQ0LCJpc19vcmdfYWRtaW4iOnRydWUsImlzX3N1cGVyYWRtaW4iOmZhbHNlLCJvcmdhbml6YXRpb25faWQiOjQwMDA1MCwidGltZXN0YW1wIjoiMjAyMi0wOS0xNlQwNDozOToyNy4xMDIrMDA6MDAiLCJvcmdhbml6YXRpb25fdXJsIjoiZnV0dXJlc2tpbGxzcHJpbWUuZWRjYXN0cHJldmlldy5jb20iLCJzZXNzaW9uX2lkIjoiMGM0NzY1NDQwZjMyOTZjOWE4NTY5ZThhNTRkOGM5ZjcifQ.vJpgO1zuXKcxPCUrnneR82jd60NEtVYNKHM9eLwHcxI")
      .end((error, response) => {
        if (!error && response) {
          resolve(response.body);
        } else {
          reject(error);
        }
      });
  });
}