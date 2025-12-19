import React from 'react'
import { useState } from 'react'
const Notesbox = ({subject,topic,content}) => {
    const [expand, setExpand] = useState(false)
  return (
    <div>
      {subject} - {topic}
        <button onClick={()=>setExpand(!expand)} >expand</button>
        {expand && <div>
            {content}
        </div> }
    </div>
  )
}

export default Notesbox
