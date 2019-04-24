import URLS from './URLS';
import StorageHelper from '../helper/StorageHelper';
const pendingRequests = [];
function resolvePendingRequest(connector) {
  const request = pendingRequests.shift();
  if (!request) return;
  const {route, params, verb, headers} = request.xhr;
  connector.xhr(route, params, verb, headers)
    .then(data => {
      request.resolve(data);
      resolvePendingRequest(connector);
    })
    .catch(err => {
      console.log('resolving pending error', err);
      request.reject(err);
      resolvePendingRequest(connector);
    })
}

class Connector {
  constructor(host) {
    this.host = host;
  }

  setEmitter(emitter) {
    this.emitter = emitter;
  }

  static clientHeaders() {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic aGlyZWlPUzoxMjg5NzcxZmEzN2Q4OWE1NGZkNGUxYTFlNDNhYjFlNQ=='
    }
  }

  static headers() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  get(route, headers) {
    return this.xhr(route, null, 'GET', headers);
  }

  put(route, params, headers) {
    return this.xhr(route, JSON.stringify(params), 'PUT', headers);
  }

  formUrlEncoded(route, params, headers) {
    const data = [];
    Object.keys(params).forEach(key => data.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`))
    return this.xhr(route, data.join('&'), 'POST', headers);
  }

  post(route, params, headers) {
    return this.xhr(route, JSON.stringify(params), 'POST', headers);
  }

  delete(route, params, headers) {
    return this.xhr(route, params, 'DELETE', headers);
  }

  xhr(route, params, verb, headers) {
    const url = route[0] === '/' ? `${this.host}${route}` : route;
    console.log(url)
    let options = Object.assign({method: verb}, params ? {body: params} : null);
    options.headers = Connector.headers();
    if (headers) Object.assign(options.headers, headers);
    return Promise.all([
      StorageHelper.getToken(),
      StorageHelper.isAdminUser(),
      StorageHelper.getSelectedUsersIds(),
    ]).then(([token, isAdmin, selectedUserIds]) => {
      if (token) options.headers = Object.assign({Authorization: `Bearer ${token.access_token}`}, options.headers);
      if (isAdmin) {
        Object.assign(options.headers, {Admin: true});
        if (selectedUserIds) Object.assign(options.headers, {userIds: selectedUserIds.join(',')});
      }
      return fetch(url, options).then(resp => {
        console.log("Response", resp.ok);
        if (resp.ok) {
          return resp.json().catch(() => Promise.resolve({}));
        }
        return resp.text().then(err => {
          try {
            err = JSON.parse(err);
          } catch (e) {
          }
          if (err.code !== 401) throw err;
          return new Promise((resolve, reject) => {
            pendingRequests.push({
              resolve,
              reject,
              xhr: {route, params, verb, headers}
            });
            if (pendingRequests.length === 1) {
              const params = {
                grant_type: 'refresh_token',
                refresh_token: token.refresh_token,
              };
              this.formUrlEncoded(`${URLS.API}/oauth/token`, params, Connector.clientHeaders())
                .then(x => {
                  StorageHelper.saveToken(x);
                  resolvePendingRequest(this);
                })
                .catch(err => new Promise(() => this.emitter.emit('logout', {})))
            }
          });
        }).catch(err => {
          console.log('error:>>>>>>', err);
          return Promise.reject(err)
        });
      });
    });
  }

}
export default Connector;
