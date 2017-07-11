/*
 * Minio Cloud Storage (C) 2016 Minio, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import storage from "local-storage-fallback";

export default class Web {
    constructor(endpoint, dispatch) {
        const namespace = 'Web'
        this.dispatch = dispatch
    }
    makeCall(path, method, options) {
        let qs = '';
        let body;
        let token = storage.getItem('token');
        let headers = {
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json',
        };
        if(token != null) {
            headers.Authorization = token;
        }

        if (['GET', 'DELETE'].indexOf(method) > -1) {
            if(typeof options !== 'undefined') {
                qs = '?' + this.getQueryString(options);
            }
        }
        // POST or PUT
        else  {
            let formData = new FormData();
            for (const key of Object.keys(options)) {
                formData.append(key, options[key])
            }

            body = formData;
            // body = JSON.stringify(options);
        }


        let url = path + qs;

        let init = { method: method,
            headers: headers,
            body: body,
            cache: 'default'
        };
        let request = new Request(url, init);


        return fetch(request);
        //     .then(function(response) {
        //     if (response.status === 401) {
        //       storage.removeItem('token')
        //       browserHistory.push(`${minioBrowserPrefix}/login`)
        //       throw new Error('Please re-login.')
        //     }
        //     if (response.status !== 200) {
        //       throw new Error(`Server returned error [${response.status}]`)
        //     }
        //
        //     return response;
        // });
        // return this.JSONrpc.call(method, {
        //   params: options
        // }, storage.getItem('token'))
        //   .catch(err => {
        //     if (err.status === 401) {
        //       storage.removeItem('token')
        //       browserHistory.push(`${minioBrowserPrefix}/login`)
        //       throw new Error('Please re-login.')
        //     }
        //     if (err.status)
        //       throw new Error(`Server returned error [${err.status}]`)
        //     throw new Error('Minio server is unreachable')
        //   })
        //   .then(res => {
        //     let json = JSON.parse(res.text)
        //     let result = json.result
        //     let error = json.error
        //     if (error) {
        //       throw new Error(error.message)
        //     }
        //     if (!Moment(result.uiVersion).isValid()) {
        //       throw new Error("Invalid UI version in the JSON-RPC response")
        //     }
        //     if (result.uiVersion !== currentUiVersion
        //       && currentUiVersion !== 'MINIO_UI_VERSION') {
        //       storage.setItem('newlyUpdated', true)
        //       location.reload()
        //     }
        //     return result
        //   })
    }
    makeCallPost(path, options) {
      return this.makeCall(path, "POST", options)
    }
    makeCallGet(path, options) {
      return this.makeCall(path, "GET", options)
    }
    makeDeleteCall(path, options) {
        return this.makeCall(path, "DELETE", options)
    }
    getQueryString(params) {
        let esc = encodeURIComponent;
        return Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
    }
  LoggedIn() {
    return !!storage.getItem('token')
  }
  Login(args) {
    return this.makeCallPost('/manager/login', args)
      .then(res => {
        if(res.headers.get("authorization") !== null) {
            storage.setItem('token', `${res.headers.get("authorization")}`)
        }
        return res
      })
  }
  Regist(args) {
    return this.makeCallPost('/manager/regist', args)
  }
  Logout() {
    storage.removeItem('token')
  }
  ServerInfo() {
    return this.makeCallGet('/manager/serverInfo')
  }
  StorageInfo() {
    return this.makeCallGet('/manager/storageInfo')
  }
  ListBuckets() {
      return this.makeCallGet('/manager/listBuckets')
  }
  MakeBucket(args) {
    return this.makeCall('MakeBucket', args)
  }
  ListObjects(args) {
    return this.makeCallGet('/manager/listObjects', args)
  }
  Download(path, args) {
    return this.makeCallGet(`/download/${path}`, args)
  }
  PresignedGet(args) {
    return this.makeCall('PresignedGet', args)
  }
  PutObjectURL(args) {
    return this.makeCall('PutObjectURL', args)
  }
  RemoveObject(path, args) {
    return this.makeDeleteCall(`/manager/file/${path}`, args)
  }
  GetAuth() {
    return this.makeCall('GetAuth')
  }
  GenerateAuth() {
    return this.makeCall('GenerateAuth')
  }
  SetAuth(args) {
    return this.makeCall('SetAuth', args)
      .then(res => {
        storage.setItem('token', `${res.token}`)
        return res
      })
  }
  GetBucketPolicy(args) {
    return this.makeCall('GetBucketPolicy', args)
  }
  SetBucketPolicy(args) {
    return this.makeCall('SetBucketPolicy', args)
  }
  ListAllBucketPolicies(args) {
    return this.makeCall('ListAllBucketPolicies', args)
  }
}
