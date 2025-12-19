import React from 'react'
import { useState } from 'react'
const Sessionbox = ({subject,analysis,notes}) => {
    const [expand, setexpand] = useState(false)
  return (
    <div>
      <h3>{subject}</h3> 
      <button onClick={()=> setexpand(!expand)}>Expand</button>
        {expand && <div>
            <div>Analysis - { analysis }</div>
           <div>Notes - { notes }</div>
        </div> }
    </div>
  )
}

export default Sessionbox
