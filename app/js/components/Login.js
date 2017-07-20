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

import React from 'react'
import logo from '../../img/logo.png'
import Alert from 'react-bootstrap/lib/Alert'
import browserHistory from 'react-router/lib/browserHistory'
import * as actions from '../actions'
import InputGroup from '../components/InputGroup'
import ButtonCheck from '../components/ButtonCheck'
import ConfirmModal from './ConfirmModal'
import Loader from 'halogen/PulseLoader'
import { minioBrowserPrefix, PATH_NAME_LOGIN, PATH_NAME_REGIST, PATH_NAME_PASSWORD_RESET } from '../constants.js'
import * as utils from '../utils'
import {PATH_NAME_VERIFICATION} from "../constants";

export default class Login extends React.Component {
  handleSubmit(event) {
    event.preventDefault()
    const {web, dispatch, loginRedirectPath, showLogin, showRegister, showPasswordReset } = this.props
    let message = ''
    if (!document.getElementById('username').value) {
      message = '密码不能为空'
    }
    if (!document.getElementById('password').value) {
      message = '用户名不能为空'
    }
    if (message) {
      dispatch(actions.showAlert({
        type: 'danger',
        message
      }))
      return
    }
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value

    if(showLogin) {
        dispatch(actions.setLoading())
        web.Login({
            username: username,
            password: password
        }).then((res) => {
            dispatch(actions.setLoadResponse(res))


            this.context.router.push(loginRedirectPath)
        }).catch(e => {
            dispatch(actions.setLoadingError(e))
        })
    }

    if(showRegister) {
        let confirmPassword = document.getElementById('confirmPassword').value
        if (password !== confirmPassword) {
            dispatch(actions.showAlert({
                type: 'warning',
                message: '两次输入密码不一致'
            }))
            return
        }
        let name = document.getElementById('name').value

        dispatch(actions.setLoading())
        web.Regist({
            name: name,
            username: username,
            password: password
        }).then((res) => {
            dispatch(actions.setLoadResponse(res, '注册成功请查收激活邮件'))
        }).catch(e => {
            dispatch(actions.setLoadingException(e))
        })
    }

    if(showPasswordReset) {

    }

  }

  componentWillMount() {
    const {dispatch, web} = this.props
    // Clear out any stale message in the alert of previous page
    dispatch(actions.showAlert({
      type: 'danger',
      message: ''
    }))
    document.body.classList.add('is-guest')

    this.history = browserHistory.listen(({pathname}) => {
      if (pathname === `${minioBrowserPrefix}/${PATH_NAME_LOGIN}`)  {
          dispatch(actions.showLogin())
      } else if(pathname === `${minioBrowserPrefix}/${PATH_NAME_REGIST}`) {
          dispatch(actions.showRegister())
      } else if(pathname.startsWith(`${minioBrowserPrefix}/${PATH_NAME_PASSWORD_RESET}`)) {
          dispatch(actions.showPasswordReset())
      } else if(pathname.startsWith(`${minioBrowserPrefix}/${PATH_NAME_VERIFICATION}`)) {
          dispatch(actions.showVerification())

          let token = pathname.substring(`/${PATH_NAME_VERIFICATION}/`.length, pathname.length);
          web.Verification(token).then((res) => {
              dispatch(actions.setLoadResponse(res, '验证成功请登录'))
              if(res.ok) {
                  setTimeout(() => {
                      dispatch(actions.hideAlert())
                      location.pathname = `${minioBrowserPrefix}/${PATH_NAME_LOGIN}`
                  },5000)
              }
          }).catch(e => {
              dispatch(actions.setLoadingError(e))
          })
      }
    })
  }

  componentWillUnmount() {
    document.body.classList.remove('is-guest')
  }

  hideAlert() {
    const {dispatch} = this.props
    dispatch(actions.hideAlert())
  }

  clickRegisterButton(e) {
    e.preventDefault()
    if (location.pathname === `${minioBrowserPrefix}/${PATH_NAME_REGIST}`) return
    browserHistory.push(utils.pathJoin(`${PATH_NAME_REGIST}`))
  }

  clickLoginButton(e) {
    e.preventDefault()
    if (location.pathname === `${minioBrowserPrefix}/${PATH_NAME_LOGIN}`) return
    browserHistory.push(utils.pathJoin(`${PATH_NAME_LOGIN}`))
  }

  sendResetPassword() {
      const {web, loginUsername} = this.props
      web.ResetPassword(loginUsername)
  }

  showSendResetPasswordConfirmation(e, object) {
    e.preventDefault()
    const {dispatch} = this.props
    dispatch(actions.showSendResetPasswordConfirmation(object))
  }

  hideSendResetPasswordConfirmation() {
    const {dispatch} = this.props
    dispatch(actions.hideSendResetPasswordConfirmation())
  }

  changeUsername(e) {
      const {dispatch} = this.props
      let username = document.getElementById('username').value
      dispatch(actions.setLoginUsername(username))
  }

  render() {
    const {alert, showLogin, showRegister, showPasswordReset, showVerification, resetPasswordConfirmation, loginUsername, loading} = this.props


    let alertBox = <Alert className={ 'alert animated ' + (alert.show ? 'fadeInDown' : 'fadeOutUp') } bsStyle={ alert.type } onDismiss={ this.hideAlert.bind(this) }>
                     <div className='text-center'>
                       { alert.message }
                     </div>
                   </Alert>
    // Make sure you don't show a fading out alert box on the initial web-page load.
    if (!alert.message)
      alertBox = ''

    let usernameInput =  <InputGroup className="ig-dark"
                                     label="邮箱"
                                     id="username"
                                     name="username"
                                     // value="lisuiheng@163.com"
                                     type="email"
                                     spellCheck="false"
                                     required="required"
                                     onChange={ this.changeUsername.bind(this) }
                                     autoComplete="username">
                          </InputGroup>

    let nameInput =  <InputGroup className="ig-dark"
                                   label="昵称"
                                   id="name"
                                   name="name"
                                   type="text"
                                   spellCheck="false"
                                   required="required"
                                   autoComplete="name">
                      </InputGroup>

    let passwordLabel = "密码"
    if(showPasswordReset) {
        passwordLabel = "重置密码"
    }

    let passwordInput = <InputGroup className="ig-dark"
                                    label={ passwordLabel }
                                    id="password"
                                    name="password"
                                    type="password"
                                    spellCheck="false"
                                    required="required"
                                    autoComplete="off">
                         </InputGroup>

    let confirmInput = <InputGroup className="ig-dark"
                                    label="确认密码"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    spellCheck="false"
                                    required="required"
                                    >
                         </InputGroup>

    let showRegisterButton =    <ButtonCheck
                                    className={ (showRegister ? 'sl-btn' : '')}
                                    value="注册"
                                    checkButton={ this.clickRegisterButton.bind(this) }>
                                </ButtonCheck>

    let showLoginButton =   <ButtonCheck
                                className={ (showLogin ? 'sl-btn' : '')}
                                value="登录"
                                checkButton={ this.clickLoginButton.bind(this) }>
                              </ButtonCheck>

    let unableLogin = <div>
                        <a className="ub-login"
                           onClick={ this.showSendResetPasswordConfirmation.bind(this) }
                        >无法登录?</a>
                        <ConfirmModal show={ resetPasswordConfirmation.show }
                                      text='修改密码链接将会发送至你的注册邮箱'
                                      sub={ loginUsername }
                                      okText='发送'
                                      cancelText='Cancel'
                                      okHandler={ this.sendResetPassword.bind(this) }
                                      cancelHandler={ this.hideSendResetPasswordConfirmation.bind(this) }>
                        </ConfirmModal>
                    </div>


    if (showLogin) {
        unableLogin = ''
        nameInput = ''
        confirmInput = ''
    }

    if (showPasswordReset) {
        showLoginButton = ''
        nameInput = ''
        showRegisterButton = ''
        usernameInput = ''
        unableLogin = ''
    }

    let form = <div className="l-wrap">
      <form onSubmit={ this.handleSubmit.bind(this) }>
          { showRegisterButton }
          { showLoginButton }
          { usernameInput }
          { nameInput }
          { passwordInput }
          { confirmInput }
          <button className="lw-btn" type="submit">
              <i className="fa fa-sign-in"></i>
          </button>
          { unableLogin }
      </form>
    </div>

    if (showVerification) {
        form = ''
    }



  if(loading) {
      form =  <div className="loading"><Loader color="#ffffff" size="16px" margin="4px"/></div>
  }
      return (
      <div className="login">
        { alertBox }
        { form }
        <div className="l-footer">
          <a className="lf-logo" href=""><img src={ logo } alt="" /></a>
          <div className="lf-server">
            { window.location.host }
          </div>
        </div>
      </div>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired
}
