import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

export function login() {
  return LoginManager.logInWithReadPermissions(['public_profile', 'email']);
}

export function fetchAccessToken() {
  return AccessToken.getCurrentAccessToken();
}

export function fetchMe(accessToken) {
  return new Promise((resolve, reject) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken,
        parameters: {
          fields: {
            string: 'email,name,gender',
          },
        },
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      },
    );
    new GraphRequestManager()
      .addRequest(infoRequest)
      .start();
  });
}

export function loginAndFetchData() {
  return login().then((result) => {
    if (result.isCancelled) return null;
    return fetchAccessToken()
      .then(rresult => fetchMe(rresult.accessToken));
  });
}


export function logout() {
  return LoginManager.logOut();
}
