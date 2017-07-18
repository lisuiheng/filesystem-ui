import React from 'react'
import connect from 'react-redux/lib/components/connect'


let LabMenu = ({buckets, clickLab }) => {
    const labNodes = buckets.map((bucket, i) => {
        return (
            <div key={ i }>
            <span className="tr-lab">
                <a href=""
                   onClick={ (e) => clickLab(e, `${bucket}`) }
                >
                    { bucket.name }
                </a>
            </span>
            <ul className="tr-eqpt">
            <span ><a >分子分析仪</a></span>
            </ul>
            <span className="tr-lab"><a >301实验室</a></span>
            </div>
        )
    })
    return (
        <div className="tr-node">
            { labNodes }
        </div>
    )
}



export default connect(state => {
    return {
        buckets: state.buckets,
    }
})(LabMenu)
