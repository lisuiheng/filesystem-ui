import { READ_ONLY, WRITE_ONLY, READ_WRITE } from '../constants'
import React, { Component, PropTypes } from 'react'
import connect from 'react-redux/lib/components/connect'
import classnames from 'classnames'
import * as actions from '../actions'

class PolicyInput extends Component {
  componentDidMount() {
    const {web, dispatch} = this.props
    this.prefix.focus()
    web.ListAllBucketPolicies({
      bucketName: this.props.currentBucket
    }).then(res => {
      let policies = res.policies
      if (policies) dispatch(actions.setPolicies(policies))
    }).catch(err => {
      dispatch(actions.showAlert({
        type: 'danger',
        message: err.message
      }))
    })
  }

  componentWillUnmount() {
    const {dispatch} = this.props
    dispatch(actions.setPolicies([]))
  }

  handlePolicySubmit(e) {
    e.preventDefault()
    const {web, dispatch, currentBucket} = this.props

    let prefix = currentBucket + '/' + this.prefix.value
    let policy = this.policy.value

    if (!prefix.endsWith('*')) prefix = prefix + '*'
 
    let prefixAlreadyExists = this.props.policies.some(elem => prefix === elem.prefix)

    if (prefixAlreadyExists) {
      dispatch(actions.showAlert({
       type: 'danger',
       message: "Policy for this prefix already exists."
      }))
      return
    }
    
    web.SetBucketPolicy({
      bucketName: this.props.currentBucket,
      prefix: this.prefix.value,
      policy: this.policy.value
    })
      .then(() => {
        dispatch(actions.setPolicies([{
          policy, prefix
        }, ...this.props.policies]))
        this.prefix.value = ''
      })
      .catch(e => dispatch(actions.showAlert({
        type: 'danger',
        message: e.message,
      })))
  }

  render() {
    return (
      <header className="pmb-list">
        <div className="pmbl-item">
          <input type="text"
            ref={ prefix => this.prefix = prefix }
            className="form-control"
            placeholder="Prefix"
            editable={ true } />
        </div>
        <div className="pmbl-item">
          <select ref={ policy => this.policy = policy } className="form-control">
            <option value={ READ_ONLY }>
              Read Only
            </option>
            <option value={ WRITE_ONLY }>
              Write Only
            </option>
            <option value={ READ_WRITE }>
              Read and Write
            </option>
          </select>
        </div>
        <div className="pmbl-item">
          <button className="btn btn-block btn-primary" onClick={ this.handlePolicySubmit.bind(this) }>
            Add
          </button>
        </div>
      </header>
    )
  }
}

export default connect(state => state)(PolicyInput)