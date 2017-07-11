
import React from 'react'
import connect from 'react-redux/lib/components/connect'

let ButtonCheck = ({value, checkButton, className}) => {

    let isChecked = ''



    return (
        <button className={ "lc-btn" + ' ' + className }
                type="button"
                onClick={ checkButton}>
            { value }
        </button>
    )
}

export default connect(state => {
    return {

    }
})(ButtonCheck)
