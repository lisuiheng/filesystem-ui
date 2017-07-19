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

import Moment from 'moment'
import browserHistory from 'react-router/lib/browserHistory'
import * as utils from './utils'
import storage from 'local-storage-fallback'
import {
    minioBrowserPrefix, EXCEPTION_EXPIRED_USER_IN_USE, EXCEPTION_EXPIRED_TOO_OFTEN,
    EXCEPTION_EXPIRED_JWT, PATH_NAME_REGIST, EXCEPTION_EXPIRED_ZUUL, PATH_NAME_LOGIN
} from './constants'

export const SET_WEB = 'SET_WEB'
export const SET_CURRENT_EQUIPMENT = 'SET_CURRENT_EQUIPMENT'
export const SET_CURRENT_LAB = 'SET_CURRENT_LAB'
export const SET_CURRENT_PATH = 'SET_CURRENT_PATH'
export const SET_OBJECTS = 'SET_OBJECTS'
export const APPEND_OBJECTS = 'APPEND_OBJECTS'
export const RESET_OBJECTS = 'RESET_OBJECTS'
export const SET_STORAGE_INFO = 'SET_STORAGE_INFO'
export const SET_SERVER_INFO = 'SET_SERVER_INFO'
export const SHOW_MAKEBUCKET_MODAL = 'SHOW_MAKEBUCKET_MODAL'
export const ADD_UPLOAD = 'ADD_UPLOAD'
export const STOP_UPLOAD = 'STOP_UPLOAD'
export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS'
export const SET_ALERT = 'SET_ALERT'
export const SET_SHOW_ABORT_MODAL = 'SET_SHOW_ABORT_MODAL'
export const SHOW_ABOUT = 'SHOW_ABOUT'
export const SET_SORT_NAME_ORDER = 'SET_SORT_NAME_ORDER'
export const SET_SORT_SIZE_ORDER = 'SET_SORT_SIZE_ORDER'
export const SET_SORT_DATE_ORDER = 'SET_SORT_DATE_ORDER'
export const SET_LATEST_UI_VERSION = 'SET_LATEST_UI_VERSION'
export const SET_SIDEBAR_STATUS = 'SET_SIDEBAR_STATUS'
export const SET_LOGIN_REDIRECT_PATH = 'SET_LOGIN_REDIRECT_PATH'
export const SET_LOAD_EQUIPMEN = 'SET_LOAD_EQUIPMEN'
export const SET_LOAD_PATH = 'SET_LOAD_PATH'
export const SHOW_SETTINGS = 'SHOW_SETTINGS'
export const SET_SETTINGS = 'SET_SETTINGS'
export const SET_SHARE_OBJECT = 'SET_SHARE_OBJECT'
export const DELETE_CONFIRMATION = 'DELETE_CONFIRMATION'
export const SET_PREFIX_WRITABLE = 'SET_PREFIX_WRITABLE'
export const REMOVE_OBJECT = 'REMOVE_OBJECT'
export const CHECKED_OBJECTS_ADD = 'CHECKED_OBJECTS_ADD'
export const CHECKED_OBJECTS_REMOVE = 'CHECKED_OBJECTS_REMOVE'
export const CHECKED_OBJECTS_RESET = 'CHECKED_OBJECTS_RESET'
export const SHOW_REGISTER = 'SHOW_REGISTER'
export const SHOW_LOGIN = 'SHOW_LOGIN'
export const SHOW_VERIFICATION = 'SHOW_VERIFICATION'
export const SHOW_PASSWORD_RESET = 'SHOW_PASSWORD_RESET'
export const SEND_RESET_PASSWORD_CONFIRMATION = 'SEND_RESET_PASSWORD_CONFIRMATION'
export const SET_LOGIN_USERNAME = 'SET_LOGIN_USERNAME'
export const SET_LOADING = 'SET_LOADING'
export const SET_LOAD_RESULT = 'SET_LOAD_RESULT'
export const SET_FROM_LAB = 'SET_FROM_LAB'
export const SET_LAB_MENU = 'SET_LAB_MENU'


export const showDeleteConfirmation = (object) => {
  return {
    type: DELETE_CONFIRMATION,
    payload: {
      object,
      show: true
    }
  }
}

export const hideDeleteConfirmation = () => {
    return {
        type: DELETE_CONFIRMATION,
        payload: {
            object: '',
            show: false
        }
    }
}

export const showSendResetPasswordConfirmation = (object) => {
    return {
        type: SEND_RESET_PASSWORD_CONFIRMATION,
        payload: {
            object,
            show: true
        }
    }
}

export const hideSendResetPasswordConfirmation = () => {
    return {
        type: SEND_RESET_PASSWORD_CONFIRMATION,
        payload: {
            object: '',
            show: false
        }
    }
}

export const showShareObject = (object, url) => {
  return {
    type: SET_SHARE_OBJECT,
    shareObject: {
      object,
      url,
      show: true
    }
  }
}

export const hideShareObject = () => {
  return {
    type: SET_SHARE_OBJECT,
    shareObject: {
      url: '',
      show: false
    }
  }
}

export const shareObject = (object, days, hours, minutes) => (dispatch, getState) => {
  const {currentEquipment, web} = getState()
  let host = location.host
  let bucket = currentEquipment

  if (!web.LoggedIn()) {
    dispatch(showShareObject(object, `${host}/${bucket}/${object}`))
    return
  }

  let expiry = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60
  web.PresignedGet({
    host,
    bucket,
    object,
    expiry
  })
    .then(obj => {
      dispatch(showShareObject(object, obj.url))
      dispatch(showAlert({
        type: 'success',
        message: `Object shared. Expires in ${days} days ${hours} hours ${minutes} minutes.`
      }))
    })
    .catch(err => {
      dispatch(showAlert({
        type: 'danger',
        message: err.message
      }))
    })
}

export const setLoginRedirectPath = (path) => {
  return {
    type: SET_LOGIN_REDIRECT_PATH,
    path
  }
}

export const setLoadPath = (loadPath) => {
  return {
    type: SET_LOAD_PATH,
    loadPath
  }
}

export const setLoadEquipmen = (loadEquipmen) => {
  return {
    type: SET_LOAD_EQUIPMEN,
    loadEquipmen: loadEquipmen
  }
}

export const setWeb = web => {
  return {
    type: SET_WEB,
    web
  }
}

export const showMakeBucketModal = () => {
  return {
    type: SHOW_MAKEBUCKET_MODAL,
    showMakeBucketModal: true
  }
}

export const hideAlert = () => {
  return {
    type: SET_ALERT,
    alert: {
      show: false,
      message: '',
      type: ''
    }
  }
}

export const showAlert = alert => {
  return (dispatch, getState) => {
    let alertTimeout = null
    if (alert.type !== 'danger') {
      alertTimeout = setTimeout(() => {
        dispatch({
          type: SET_ALERT,
          alert: {
            show: false
          }
        })
      }, 5000)
    }
    dispatch({
      type: SET_ALERT,
      alert: Object.assign({}, alert, {
        show: true,
        alertTimeout
      })
    })
  }
}

export const removeObject = object => {
  return {
    type: REMOVE_OBJECT,
    object
  }
}

export const setSidebarStatus = (status) => {
  return {
    type: SET_SIDEBAR_STATUS,
    sidebarStatus: status
  }
}

export const hideMakeBucketModal = () => {
  return {
    type: SHOW_MAKEBUCKET_MODAL,
    showMakeBucketModal: false
  }
}

export const setVisibleBuckets = visibleBuckets => {
  return {
    type: SET_VISIBLE_BUCKETS,
    visibleBuckets
  }
}

const appendObjects = (objects, marker, istruncated) => {
  return {
    type: APPEND_OBJECTS,
    objects,
    marker,
    istruncated
  }
}

export const setObjects = (objects) => {
  return {
    type: SET_OBJECTS,
    objects,
  }
}

export const resetObjects = () => {
  return {
    type: RESET_OBJECTS
  }
}

export const setCurrentEquipment = currentEquipment => {
  return {
    type: SET_CURRENT_EQUIPMENT,
    currentEquipment
  }
}

export const setCurrentLab = currentLab => {
  return {
    type: SET_CURRENT_LAB,
    currentLab
  }
}

export const setCurrentPath = currentPath => {
  return {
    type: SET_CURRENT_PATH,
    currentPath
  }
}

export const setStorageInfo = storageInfo => {
  return {
    type: SET_STORAGE_INFO,
    storageInfo
  }
}

export const setServerInfo = serverInfo => {
  return {
    type: SET_SERVER_INFO,
    serverInfo
  }
}

const setPrefixWritable = prefixWritable => {
  return {
    type: SET_PREFIX_WRITABLE,
    prefixWritable,
  }
}

export const selectBucketByName = (newCurrentBucketName) => {
    return (dispatch, getState) => {
        let buckets = getState().buckets
        let newCurrentBuckets = buckets.filter(bucket => {return bucket.name == newCurrentBucketName});
        if (newCurrentBuckets.length) {
            dispatch(selectEquipment(newCurrentBuckets[0]))
        }
        return
    }

}

export const selectEquipment1 = (newCurrentEquipment) => {

  return (dispatch, getState) => {
    let {currentEquipment, web} = getState()

    if (currentEquipment !== newCurrentEquipment) dispatch(setLoadEquipmen(newCurrentEquipment))
    dispatch(setCurrentEquipment(newCurrentEquipment))

    //loadObject
    dispatch(resetObjects())
    dispatch(setLoadPath(prefix))

    dispatch(refreshStorageInfo())

    web.ListObjects({
      ownerType: "EQUIPMENT",
      ownerId: currentEquipment.id
    }).then((res) => {
      if(res.headers.get("lab")) {
          dispatch(setFromLab())
      } else {
          dispatch(setNotFromLab())
      }



      let listObjects = (objects) => {
          if (!objects)
              objects = []
          objects = objects.map(object => {
              object.name = object.name.replace(`${prefix}`, '');

              web.GetUser(object.createOper).then(res => {
                  let returnUser = user => {
                      object.createOperName = user.name;
                      return object
                  }
                  dispatch(setLoadResponse(res, '', null, returnUser))
              })
              return object
          })
          dispatch(appendObjects(
              objects,
              res.nextmarker,
              res.istruncated
          ))
          dispatch(setPrefixWritable(res.writable))
          dispatch(setSortNameOrder(false))
          dispatch(setCurrentPath(prefix))
          dispatch(setLoadEquipmen(''))
          dispatch(setLoadPath(''))
      }
      dispatch(setLoadResponse(res, null, null, listObjects))

    }).catch(e => {
      dispatch(setLoadingError(e))
    })
    return
  }
}

export const listObjects = () => {
  return (dispatch, getState) => {
    const {currentEquipment, currentPath, marker, objects, istruncated, web} = getState()
    if (!istruncated) return
    web.ListObjects({
        ownerType: "EQUIPMENT",
        ownerId: currentEquipment.id
    }).then((res) => {
        if(res.headers.get("lab")) {
            dispatch(setFromLab())
        } else {
            dispatch(setNotFromLab())
        }

        let listBuckets = (objects) => {
            if (!objects)
                objects = []
            objects = objects.map(object => {
                object.name = object.name.replace(`${currentPath}`, '');

            })
            dispatch(appendObjects(objects, res.nextmarker, res.istruncated))
            dispatch(setPrefixWritable(res.writable))
            dispatch(setLoadEquipmen(''))
            dispatch(setLoadPath(''))
        }
        dispatch(setLoadResponse(res, null, null, listBuckets))

    }).catch(e => {
        dispatch(setLoadingError(e))
    })
  }
}


export const selectPrefix = prefix => {
  return (dispatch, getState) => {
    const {currentEquipment, web} = getState()
    dispatch(resetObjects())
    dispatch(setLoadPath(prefix))

    dispatch(refreshStorageInfo())

      web.ListObjects({
        ownerType: "EQUIPMENT",
        ownerId: currentEquipment.id
    }).then((res) => {
        if(res.headers.get("lab")) {
            dispatch(setFromLab())
        } else {
            dispatch(setNotFromLab())
        }



        let listObjects = (objects) => {
            if (!objects)
                objects = []
            objects = objects.map(object => {
                object.name = object.name.replace(`${prefix}`, '');

                web.GetUser(object.createOper).then(res => {
                    let returnUser = user => {
                        object.createOperName = user.name;
                        return object
                    }
                    dispatch(setLoadResponse(res, '', null, returnUser))
                })
                return object
            })
            dispatch(appendObjects(
                objects,
                res.nextmarker,
                res.istruncated
            ))
            dispatch(setPrefixWritable(res.writable))
            dispatch(setSortNameOrder(false))
            dispatch(setCurrentPath(prefix))
            dispatch(setLoadEquipmen(''))
            dispatch(setLoadPath(''))
        }
        dispatch(setLoadResponse(res, null, null, listObjects))

    }).catch(e => {
        dispatch(setLoadingError(e))
    })
  }
}

export const refreshStorageInfo = () => {
    return (dispatch, getState) => {
        const {web} = getState()
        web.GetUser(web.LoginUser().id).then(res => {
            let refresh =  currentUser => {
                dispatch(setStorageInfo(Object.assign({}, {
                    total: currentUser.total,
                    free: currentUser.total - currentUser.used
                })))

            }
            dispatch(setLoadResponse(res, '', null, refresh))
        })
    }

}

export const addUpload = options => {
  return {
    type: ADD_UPLOAD,
    slug: options.slug,
    size: options.size,
    xhr: options.xhr,
    name: options.name
  }
}

export const stopUpload = options => {
  return {
    type: STOP_UPLOAD,
    slug: options.slug
  }
}

export const uploadProgress = options => {
  return {
    type: UPLOAD_PROGRESS,
    slug: options.slug,
    loaded: options.loaded
  }
}

export const setShowAbortModal = showAbortModal => {
  return {
    type: SET_SHOW_ABORT_MODAL,
    showAbortModal
  }
}



export const downloadSelected = (url, req, xhr) => {
  return (dispatch) => {
    let anchor = document.createElement('a')
    document.body.appendChild(anchor);
    xhr.open('POST', url, true)
    xhr.responseType = 'blob'

    xhr.onload = function(e) {
      if (this.status == 200) {
        dispatch(checkedObjectsReset())
        let blob = new Blob([this.response], {
          type: 'octet/stream'
        })
        let blobUrl = window.URL.createObjectURL(blob);
        let separator = req.prefix.length > 1 ? '-' : ''

        anchor.href = blobUrl
        anchor.download = req.bucketName+separator+req.prefix.slice(0, -1)+'.zip';

        anchor.click()
        window.URL.revokeObjectURL(blobUrl)
        anchor.remove()
      }
    };
    xhr.send(JSON.stringify(req));
  }
}

export const uploadFile = (file, xhr) => {
  return (dispatch, getState) => {
    const {currentEquipment, currentPath, storageInfo} = getState()
    const uploadUrl = `${window.location.origin}/zuul/storage/submit?ownerType=EQUIPMENT&ownerId=${currentEquipment.id}`
    const slug = `${currentEquipment}-${currentPath}-${file.name}`

    xhr.open('POST', uploadUrl, true)
    xhr.withCredentials = false
    const token = storage.getItem('token')
    if (token) xhr.setRequestHeader("Authorization", 'Bearer ' + storage.getItem('token'))
    xhr.setRequestHeader('x-amz-date', Moment().utc().format('YYYYMMDDTHHmmss') + 'Z')
    dispatch(addUpload({
      slug,
      xhr,
      size: file.size,
      name: file.name
    }))

    xhr.onload = function(event) {
      if (xhr.status == 401 || xhr.status == 403 || xhr.status == 500) {
        setShowAbortModal(false)
        dispatch(stopUpload({
          slug
        }))
        dispatch(showAlert({
          type: 'danger',
          message: 'Unauthorized request.'
        }))
      }
      if (xhr.status == 200 || xhr.status === 201) {
        setShowAbortModal(false)
        dispatch(setStorageInfo(Object.assign({}, {
            total: storageInfo.total,
            free: storageInfo.total - file.size
        })))
        dispatch(stopUpload({
          slug
        }))
        dispatch(showAlert({
          type: 'success',
          message: 'File \'' + file.name + '\' uploaded successfully.'
        }))
        dispatch(selectPrefix(currentPath))
      }
    }

    xhr.upload.addEventListener('error', event => {
      dispatch(showAlert({
        type: 'danger',
        message: 'Error occurred uploading \'' + file.name + '\'.'
      }))
      dispatch(stopUpload({
        slug
      }))
    })

    xhr.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        let loaded = event.loaded
        let total = event.total

        // Update the counter.
        dispatch(uploadProgress({
          slug,
          loaded
        }))
      }
    })
    let formData = new FormData();
    formData.append("file", file);
    xhr.overrideMimeType("text/plain; charset=utf-8");
    xhr.send(formData)
  }
}

export const showAbout = () => {
  return {
    type: SHOW_ABOUT,
    showAbout: true
  }
}

export const hideAbout = () => {
  return {
    type: SHOW_ABOUT,
    showAbout: false
  }
}

export const setSortNameOrder = (sortNameOrder) => {
  return {
    type: SET_SORT_NAME_ORDER,
    sortNameOrder
  }
}

export const setSortSizeOrder = (sortSizeOrder) => {
  return {
    type: SET_SORT_SIZE_ORDER,
    sortSizeOrder
  }
}

export const setSortDateOrder = (sortDateOrder) => {
  return {
    type: SET_SORT_DATE_ORDER,
    sortDateOrder
  }
}

export const setLatestUIVersion = (latestUiVersion) => {
  return {
    type: SET_LATEST_UI_VERSION,
    latestUiVersion
  }
}

export const showSettings = () => {
  return {
    type: SHOW_SETTINGS,
    showSettings: true
  }
}

export const hideSettings = () => {
  return {
    type: SHOW_SETTINGS,
    showSettings: false
  }
}

export const setSettings = (settings) => {
  return {
    type: SET_SETTINGS,
    settings
  }
}


export const checkedObjectsAdd = (object) => {
  return {
    type: CHECKED_OBJECTS_ADD,
      object
  }
}

export const checkedObjectsRemove = (object) => {
  return {
    type: CHECKED_OBJECTS_REMOVE,
      object
  }
}

export const checkedObjectsReset = (object) => {
  return {
    type: CHECKED_OBJECTS_RESET,
      object
  }
}

export const showRegister = () => {
    return {
        type: SHOW_REGISTER,
        showRegister: true
    }
}

export const showLogin = () => {
    return {
        type: SHOW_LOGIN,
        showLogin: true
    }
}

export const showVerification= () => {
    return {
        type: SHOW_VERIFICATION,
        showVerification: true
    }
}

export const showPasswordReset = () => {
    return {
        type: SHOW_PASSWORD_RESET,
        showPasswordReset: true
    }
}

export const setLoginUsername = (username) => {
    return {
        type: SET_LOGIN_USERNAME,
        username
    }
}

export const setLoading = () => {
    return {
        type: SET_LOADING,
        loading: true
    }
}

export const setLoadResponse = (res, successMsg, errorMsg, handleSuccess) => {
    return (dispatch, getState) => {
        let handleResponse = (result, status) => {
            const { web } = getState()
            if(!status) {
                status = res.status
            }

            let errorMessage = ''
            let successMessage = ''
            if(status === 200) {
                if(handleSuccess) {
                    handleSuccess(result)
                }
            } else if(status === 401) {
                errorMessage = '用户名或密码错误请重新输入'
            } else if(status === 500) {
                let exception = result.exception;
                if(exception === EXCEPTION_EXPIRED_USER_IN_USE) {
                    errorMessage = '用户已存在'
                } else if(exception === EXCEPTION_EXPIRED_TOO_OFTEN || exception ===  EXCEPTION_EXPIRED_ZUUL) {
                    errorMessage = result.message
                } else if(exception === EXCEPTION_EXPIRED_JWT) {
                    if(result.path.includes(PATH_NAME_REGIST)) {
                        errorMessage = '链接超时失效请重新注册'
                        setTimeout(() => {
                            dispatch(hideAlert())
                            web.Logout()
                            location.pathname = `${minioBrowserPrefix}/${PATH_NAME_REGIST}`
                        },5000)
                    } else {
                        errorMessage = '登录超时请重新登录'
                        setTimeout(() => {
                            dispatch(hideAlert())
                            location.pathname = `${minioBrowserPrefix}/${PATH_NAME_LOGIN}`
                        },5000)
                    }

                } else {
                    errorMessage = '服务器错误'
                }
            } else if(status === 504) {
                if(result) {
                    errorMessage = result
                } else {
                    errorMessage = '服务器错误'
                }

            }


            if(res.ok) {
                if(successMsg === undefined) {
                    successMessage = '成功'
                } else {
                    successMessage = successMsg
                }
                dispatch(setLoadingSuccess(successMessage))
            } else {
                if(errorMsg) {
                    errorMessage = errorMsg
                } else if(!errorMessage) {
                    errorMessage = '失败'
                }
                dispatch(setLoadingError(errorMessage))
            }
        }

        let resPromise
        let content = res.headers.get("content-type");
        if(!content) {
        }else if(content.startsWith("application/json")) {
            resPromise = res.json()
        } else {
            resPromise = res.text()
        }
        if(resPromise) {

            resPromise.then(handleResponse)
        } else {
            handleResponse(null, res.status)
        }

    }
}





export const setLoadingSuccess = (message) => {
    return (dispatch) => {

        dispatch(showAlert({
            type: 'success',
            message: message
        }))
        dispatch(setLoadingOff())
    }
}


export const setLoadingError = ( message) => {
    return (dispatch) => {
        dispatch(showAlert({
            type: 'danger',
            message: message
        }))
        dispatch(setLoadingOff())
    }

}

export const setLoadingException = (e) => {
    return (dispatch) => {
        dispatch(showAlert({
            type: 'danger',
            message: e.message
        }))
        return {
            type: SET_LOADING,
            loading: false
        }
    }
}

export const setLoadingOff = () => {
    return {
        type: SET_LOADING,
        loading: false
    }
}
export const setLoadResult = (status, result) => {
    return {
        type: SET_LOAD_RESULT,
        loadResponse: {
            status: status,
            result: result
        }
    }
}


export const setFromLab = () => {
    return {
        type: SET_FROM_LAB,
        fromLab: true
    }
}

export const setNotFromLab = () => {
    return {
        type: SET_FROM_LAB,
        fromLab: false
    }
}


export const setLabMenu = labMenu => {
    return {
        type: SET_LAB_MENU,
        labMenu
    }
}

export const setLabs = labs => {
    return (dispatch) => {
        let labMenu = []
        for (let lab of labs) {
            labMenu.push({
                lab: lab,
                equipments: [],
                close: true
            })
        }
        dispatch(setLabMenu(labMenu))
    }

}

export const setEquipments = (labId, equipments) => {
    return (dispatch, getState) => {
        let labMenu = getState().labMenu;
        for (let labNode of labMenu) {
            if(labNode.lab.id === labId) {
                labNode.equipments = equipments
            }
        }
        dispatch(setLabMenu(labMenu))
    }
}

export const selectEquipment = equipment => {
    return (dispatch, getState) => {
        const { labMenu, currentEquipment, web } = getState();
        if(currentEquipment !== equipment) {
            dispatch(setCurrentEquipment(equipment))

            // let getLabById = (lab) => {
            //     console.log("selectLab", lab)
            //     dispatch(selectLab(lab))
            // }
            // console.log(equipment)
            // web.GetLabById(equipment.labId).then((res => {
            //     dispatch(setLoadResponse(res, null, null, getLabById))
            // }))

            //loadObject
            dispatch(resetObjects())

            dispatch(refreshStorageInfo())

            web.ListObjects({
                ownerType: "EQUIPMENT",
                ownerId: equipment.id
            }).then((res) => {
                if(res.headers.get("lab")) {
                    dispatch(setFromLab())
                } else {
                    dispatch(setNotFromLab())
                }



                let listObjects = (objects) => {
                    if (!objects)
                        objects = []
                    objects = objects.map(object => {
                        web.GetUser(object.createOper).then(res => {
                            let returnUser = user => {
                                if(user) {
                                    object.createOperName = user.name;
                                    object.createOperUsername = user.username;
                                    return object
                                }
                            }
                            dispatch(setLoadResponse(res, '', null, returnUser))
                        })
                        return object
                    })
                    dispatch(appendObjects(
                        objects,
                        res.nextmarker,
                        res.istruncated
                    ))
                    dispatch(setPrefixWritable(res.writable))
                    dispatch(setSortNameOrder(false))
                    dispatch(setLoadEquipmen(''))
                    dispatch(setLoadPath(''))
                }
                dispatch(setLoadResponse(res, null, null, listObjects))

            }).catch(e => {
                dispatch(setLoadingError(e))
            })
        }
    }
}

export const selectLab = selectLab => {

    return (dispatch, getState) => {
        const { labMenu, currentLab, web } = getState();
        if(!currentLab ||  selectLab.id !== currentLab.id) {
            dispatch(setCurrentLab(selectLab))
        }



        for (let labNode of labMenu) {
            let lab = labNode.lab;
            if(lab.id === selectLab.id) {
                labNode.close = !labNode.close
                lab = selectLab
                if(!lab.equipments) {
                    let listEquipments = (equipments) => {
                        dispatch(setEquipments(lab.id, equipments))
                    }
                    web.ListEquipments(lab.id).then((res => {
                        dispatch(setLoadResponse(res, null, null, listEquipments))
                    }))
                }
            }
        }
        dispatch(setLabMenu(labMenu))


    }
}

