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
import classNames from 'classnames'
import ClickOutHandler from 'react-onclickout'
import * as actions from '../actions'
import Scrollbars from 'react-custom-scrollbars/lib/Scrollbars'
import connect from 'react-redux/lib/components/connect'
import logo from '../../img/logo.png'

let SideBar = ({dispatch, selectEquipment, selectLab, currentEquipment, web, searchBuckets, sidebarStatus, clickOutside, labMenu}) => {

    const helloUser = <div className="fes-host">
                            <h3 href="/">
                                {web.LoginUser().name},欢迎您!
                            </h3>
                        </div>


    const labNodes = labMenu.map((labNode, i) => {

        let equipmentNodes = ''

        if(!labNode.close) {
            equipmentNodes  = labNode.equipments.map((equipmentNode, i) => {
                return (
                    <ul key={ i } className="tr-eqpt">
                        <span ><a onClick={ (e) => selectEquipment(e, equipmentNode) }>{equipmentNode.name}</a></span>
                    </ul>
                )
            })
        }



        return (
            <div key={ i }>
            <span className="tr-lab sl-tr">
                <a
                   onClick={ (e) => selectLab(e, labNode.lab ) }
                >
                    { labNode.lab.name }
                </a>
                { equipmentNodes }
            </span>

            </div>
        )
    })

  // const list = visibleBuckets.map((bucket, i) => {
  //   return <li className={ classNames({
  //                 'active': bucket === currentEquipment
  //               }) } key={ i } onClick={ (e) => {
  //                   selectEquipment(e, bucket)
  //               } }>
  //            <a href="" className={ classNames({
  //                                     'fesli-loading': bucket === loadEquipmen
  //                                   }) }>
  //              { bucket.name }
  //            </a>
  //            <i className="fesli-trigger" onClick={ showPolicy }></i>
  //          </li>
  // })

  return (
    <ClickOutHandler onClickOut={ clickOutside }>
      <div className={ classNames({
                         'fe-sidebar': true,
                         'toggled': sidebarStatus
                       }) }>
        <div className="fes-header clearfix hidden-sm hidden-xs">
          <img src={ logo } alt="" />
          <h2>实验数据管理平台</h2>
        </div>
        <div className="fes-list">
            {/*TODO */}
          {/*<div className="input-group ig-dark ig-left ig-search" style={ { display: web.LoggedIn() ? 'block' : 'none' } }>*/}
            {/*<input className="ig-text"*/}
              {/*type="text"*/}
              {/*onChange={ searchBuckets }*/}
              {/*placeholder="Search Buckets..." />*/}
            {/*<i className="ig-helpers"></i>*/}
          {/*</div>*/}

          {/*<div className="fesl-inner">*/}
            {/*<Scrollbars renderScrollbarVertical={ props => <div className="scrollbar-vertical" /> }>*/}
              {/*<ul>*/}
                {/*{ list }*/}
              {/*</ul>*/}
            {/*</Scrollbars>*/}
          {/*</div>*/}
          <div className="tr-node">
              { labNodes }
          </div>

        </div>
          { helloUser }
      </div>
    </ClickOutHandler>
  )
}

// Subscribe it to state changes that affect only the sidebar.
export default connect(state => {
  return {
    visibleBuckets: state.visibleBuckets,
    loadEquipmen: state.loadEquipmen,
    currentEquipment: state.currentEquipment,
    sidebarStatus: state.sidebarStatus,
    buckets: state.buckets,
    labMenu: state.labMenu,
    web: state.web,
    dispatch: state.dispatch,
  }
})(SideBar)
