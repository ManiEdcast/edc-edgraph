import * as userRequests from 'edc-web-sdk/requests/users';
import {setToken, JWT} from 'edc-web-sdk/requests/csrfToken';





export function getEdcastUserInfo() {
  return userRequests.getUserInfo().then(data => {
    setToken(data.csrfToken);
    JWT.token = data.jwtToken;
    // dispatch({
    //     type: actionTypes.GET_EDCAST_USER_INFO,
    //     data: data
    // });
    return data
  }).catch(err => {
    if (err.toString() === 'Error: Unauthorized') {
        document.location = '/log_in';
    }
  });
}