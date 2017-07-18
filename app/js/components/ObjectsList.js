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
import Moment from 'moment'
import humanize from 'humanize'
import connect from 'react-redux/lib/components/connect'
import Dropdown from 'react-bootstrap/lib/Dropdown'

let ObjectsList = ({web, objects, currentPath, selectPrefix, dataType, showDeleteConfirmation, shareObject, loadPath, checkObject, checkedObjectsArray}) => {
  const list = objects.map((object, i) => {
    let size = object.name.endsWith('/') ? '-' : humanize.filesize(object.size)
    let lastModified = object.name.endsWith('/') ? '-' : Moment(object.lastModified).format('lll')
    let loadingClass = loadPath === `${currentPath}${object.name}` ? 'fesl-loading' : ''
    let actionButtons = ''
    let deleteButton = ''
    if (web.LoggedIn())
      deleteButton = <a href="" className="fiad-action" onClick={ (e) => showDeleteConfirmation(e, object) }><i className="fa fa-trash"></i></a>

    if (!checkedObjectsArray.length > 0) {
      if (!object.name.endsWith('/')) {
        actionButtons = <Dropdown id={ "fia-dropdown-" + object.name.replace('.', '-') }>
                          <Dropdown.Toggle noCaret className="fia-toggle"></Dropdown.Toggle>
                          <Dropdown.Menu>
                            {/*<a href="" className="fiad-action" onClick={ (e) => shareObject(e, `${currentPath}${object.name}`) }><i className="fa fa-copy"></i></a>*/}
                            { deleteButton }
                          </Dropdown.Menu>
                        </Dropdown>
      }
    }

    let activeClass = ''
    let isChecked = ''

    if (checkedObjectsArray.indexOf(object.name) > -1) {
      activeClass = ' fesl-row-selected'
      isChecked = true
    }

    let createOperDiv = ''
    if(web.LoginUser().roles[0] === "ADMIN") {
        // web.GetUser(object.createOper).then(res => {
        //     if(res.headers.get("content-type").startsWith("application/json")) {
        //         res.json().then(user => {
        //             console.log(user)
        //             createOperDiv = <div className="fesl-item fesl-create-oper">
        //                 { user.createOperName }
        //             </div>
        //         })
        //     }
        // })

        createOperDiv = <div className="fesl-item fesl-create-oper">
            { object.createOperName }({ object.createOperUsername}
        </div>

    }

    return (
      <div key={ i } className={ "fesl-row " + loadingClass + activeClass } data-type={ dataType(object.name, object.contentType) }>
        <div className="fesl-item fesl-item-icon">
          <div className="fi-select">
            <input type="checkbox"
              name={ object.name }
              checked={ isChecked }
              onChange={ (e) => checkObject(e, object) } />
            <i className="fis-icon"></i>
            <i className="fis-helper"></i>
          </div>
        </div>
        <div className="fesl-item fesl-item-name">
          <a href="" onClick={ (e) => selectPrefix(e, `${object.name}`) }>
            { object.name }
          </a>
        </div>
          { createOperDiv }
        <div className="fesl-item fesl-item-size">
          { size }
        </div>
        <div className="fesl-item fesl-item-modified">
          { lastModified }
        </div>
        <div className="fesl-item fesl-item-actions">
          { actionButtons }
        </div>
      </div>
    )
  })
  return (
    <div>
      { list }
    </div>
  )
}

// Subscribe it to state changes.
export default connect(state => {
  return {
    web: state.web,
    objects: state.objects,
    currentPath: state.currentPath,
    loadPath: state.loadPath
  }
})(ObjectsList)
