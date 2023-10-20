// x-authorization is used by Safari as it's replacing Bearer token with with basicAuth credentials
export default function authHeader(access_token=null) {
  if (access_token){
    return { 
      'authorization': 'Bearer ' + access_token,
      'x-authorization': 'Bearer ' + access_token
    }
  }

  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.access_token) {
    return { 
      'authorization': 'Bearer ' + user.access_token,
      'x-authorization': 'Bearer ' + user.access_token
    };
  } else {
    return {};
  }
}
