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

import * as actions from './actions'
import { minioBrowserPrefix } from './constants'

export default (state = {
    objects: [],
    istruncated: true,
    storageInfo: {},
    serverInfo: {},
    currentEquipment: {},
    currentLab: {},
    currentPath: '',
    showMakeBucketModal: false,
    uploads: {},
    alert: {
      show: false,
      type: 'danger',
      message: ''
    },
    sortNameOrder: false,
    sortSizeOrder: false,
    sortDateOrder: false,
    latestUiVersion: currentUiVersion,
    sideBarActive: false,
    loginRedirectPath: minioBrowserPrefix,
    settings: {
      accessKey: '',
      secretKey: '',
      secretKeyVisible: false
    },
    showSettings: false,
    overwriteConfirmation: {
      object: '',
      show: false
    },
    deleteConfirmation: {
        object: '',
        show: false
    },
    resetPasswordConfirmation: {
        object: '',
        show: false
    },
    shareObject: {
      show: false,
      url: '',
      object: ''
    },
    prefixWritable: false,
    checkedObjects: [],
    showRegister: false,
    showLogin: true,
    showVerification: false,
    showPasswordReset: false,
    loginUsername: '',
    loading: false,
    loadResult: {
        status: '',
        result: {}
    },
    fromLab: false,
    labs: [],
    labMenu: [],
  }, action) => {
  let newState = Object.assign({}, state)
  switch (action.type) {
    case actions.SET_WEB:
      newState.web = action.web
      break
    case actions.SET_CURRENT_EQUIPMENT:
      newState.currentEquipment = action.currentEquipment
      break
    case actions.SET_CURRENT_LAB:
      newState.currentLab = action.currentLab
      break
    case actions.APPEND_OBJECTS:
      newState.objects = [...newState.objects, ...action.objects]
      newState.marker = action.marker
      newState.istruncated = action.istruncated
      break
    case actions.SET_OBJECTS:
      newState.objects = [...action.objects]
      break
    case actions.RESET_OBJECTS:
      newState.objects = []
      newState.marker = ""
      newState.istruncated = false
      break
    case actions.SET_CURRENT_PATH:
      newState.currentPath = action.currentPath
      break
    case actions.SET_STORAGE_INFO:
      newState.storageInfo = action.storageInfo
      break
    case actions.SET_SERVER_INFO:
      newState.serverInfo = action.serverInfo
      break
    case actions.SHOW_MAKEBUCKET_MODAL:
      newState.showMakeBucketModal = action.showMakeBucketModal
      break
    case actions.UPLOAD_PROGRESS:
      newState.uploads = Object.assign({}, newState.uploads)
      newState.uploads[action.slug].loaded = action.loaded
      break
    case actions.ADD_UPLOAD:
      newState.uploads = Object.assign({}, newState.uploads, {
        [action.slug]: {
          loaded: 0,
          size: action.size,
          xhr: action.xhr,
          name: action.name
        }
      })
      break
    case actions.STOP_UPLOAD:
      newState.uploads = Object.assign({}, newState.uploads)
      delete newState.uploads[action.slug]
      break
    case actions.SET_ALERT:
      if (newState.alert.alertTimeout) clearTimeout(newState.alert.alertTimeout)
      if (!action.alert.show) {
        newState.alert = Object.assign({}, newState.alert, {
          show: false
        })
      } else {
        newState.alert = action.alert
      }
      break
    case actions.SET_LOGIN_ERROR:
      newState.loginError = true
      break
    case actions.SET_SHOW_ABORT_MODAL:
      newState.showAbortModal = action.showAbortModal
      break
    case actions.SHOW_ABOUT:
      newState.showAbout = action.showAbout
      break
    case actions.SET_SORT_NAME_ORDER:
      newState.sortNameOrder = action.sortNameOrder
      break
    case actions.SET_SORT_SIZE_ORDER:
      newState.sortSizeOrder = action.sortSizeOrder
      break
    case actions.SET_SORT_DATE_ORDER:
      newState.sortDateOrder = action.sortDateOrder
      break
    case actions.SET_LATEST_UI_VERSION:
      newState.latestUiVersion = action.latestUiVersion
      break
    case actions.SET_SIDEBAR_STATUS:
      newState.sidebarStatus = action.sidebarStatus
      break
    case actions.SET_LOGIN_REDIRECT_PATH:
      newState.loginRedirectPath = action.path
    case actions.SET_LOAD_EQUIPMEN:
      newState.loadEquipmen = action.loadEquipmen
      break
    case actions.SET_LOAD_PATH:
      newState.loadPath = action.loadPath
      break
    case actions.SHOW_SETTINGS:
      newState.showSettings = action.showSettings
      break
    case actions.SET_SETTINGS:
      newState.settings = Object.assign({}, newState.settings, action.settings)
      break
    case actions.DELETE_CONFIRMATION:
      newState.deleteConfirmation = Object.assign({}, action.payload)
      break
    case actions.OVERWRITE_CONFIRMATION:
      newState.overwriteConfirmation = Object.assign({}, action.payload)
      break
    case actions.SEND_RESET_PASSWORD_CONFIRMATION:
      newState.resetPasswordConfirmation = Object.assign({}, action.payload)
      break
    case actions.SET_SHARE_OBJECT:
      newState.shareObject = Object.assign({}, action.shareObject)
      break
    case actions.SET_PREFIX_WRITABLE:
      newState.prefixWritable = action.prefixWritable
      break
    case actions.REMOVE_OBJECT:
      let idx = newState.objects.findIndex(object => object === action.object)
      if (idx == -1) break
      newState.objects = [...newState.objects.slice(0, idx), ...newState.objects.slice(idx + 1)]
      break

    case actions.CHECKED_OBJECTS_ADD:
      newState.checkedObjects = [...newState.checkedObjects, action.object]
      break
    case actions.CHECKED_OBJECTS_REMOVE:
      let index = newState.checkedObjects.indexOf(action.object)
      if (index == -1) break
      newState.checkedObjects = [...newState.checkedObjects.slice(0, index), ...newState.checkedObjects.slice(index + 1)]
      break
    case actions.CHECKED_OBJECTS_RESET:
      newState.checkedObjects = []
      break
    case actions.SHOW_REGISTER:
      newState.showRegister = action.showRegister
      newState.showLogin = false
      newState.showPasswordReset = false
        newState.showVerification = false
      break
    case actions.SHOW_LOGIN:
      newState.showLogin = action.showLogin
      newState.showRegister = false
      newState.showVerification = false
      newState.showPasswordReset = false
      break
    case actions.SHOW_VERIFICATION:
        newState.showVerification = action.showVerification
        newState.showLogin = false
        newState.showRegister = false
        newState.showPasswordReset = false
        break
    case actions.SHOW_PASSWORD_RESET:
        newState.showPasswordReset = action.showPasswordReset
        newState.showLogin = false
        newState.showRegister = false
        newState.showVerification = false
        break
    case actions.SET_LOGIN_USERNAME:
      newState.loginUsername = action.username
      break
    case actions.SET_LOADING:
      newState.loading = action.loading
      break
    case actions.SET_LOAD_RESULT:
      newState.loadResult = action.loadResult
      break
    case actions.SET_FROM_LAB:
      newState.fromLab = action.fromLab
    break
    case actions.SET_LAB_MENU:
      newState.labMenu = action.labMenu
    break
  }

  return newState
}
