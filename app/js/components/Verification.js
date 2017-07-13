
import React from 'react'
import Alert from 'react-bootstrap/lib/Alert'
import * as actions from '../actions'
import * as constants from '../constants'

export default class Verification extends React.Component {
    componentDidMount() {
        const {web, dispatch, loginRedirectPath} = this.props

        let pathname = location.pathname;
        let token = pathname.substring('/verification/'.length, pathname.length);

        let context = this.context
        web.Verification(token).then((res) => {
            if(res.ok) {
                context.router.push(loginRedirectPath)
            } else {
                res.json().then(function (result) {
                    if(result.exception === constants.EXCEPTION_EXPIRED_JWT) {
                        dispatch(actions.setLoginError())
                        dispatch(actions.showAlert({
                            type: 'danger',
                            message: '链接超时失效请重新注册'
                        }))
                       let t = setTimeout(() => {
                            dispatch(actions.hideAlert())
                           context.router.push(loginRedirectPath)
                       },5000)
                    }

                });
            }
        }).catch(e => {
            dispatch(actions.setLoginError())
            dispatch(actions.showAlert({
                type: 'danger',
                message: e.message
            }))
        });
    }

    componentWillMount() {
        const {dispatch} = this.props
        // Clear out any stale message in the alert of previous page
        dispatch(actions.showAlert({
            type: 'danger',
            message: ''
        }))
    }



    hideAlert() {
        const {dispatch} = this.props
        dispatch(actions.hideAlert())
    }

    render() {
        const {alert} = this.props
        let alertBox = <Alert className={ 'alert animated ' + (alert.show ? 'fadeInDown' : 'fadeOutUp') } bsStyle={ alert.type } onDismiss={ this.hideAlert.bind(this) }>
            <div className='text-center'>
                { alert.message }
            </div>
        </Alert>
        // Make sure you don't show a fading out alert box on the initial web-page load.
        if (!alert.message)
            alertBox = ''

        return (
            <div className="login">
                { alertBox }
                <div className="l-wrap">
                </div>
            </div>
        )
    }
}

Verification.contextTypes = {
    router: React.PropTypes.object.isRequired
}
