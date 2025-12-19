import React from 'react'
import { useState } from 'react'
import Analysisbox from '../components/Analysisbox'
const Analysis = () => {
  const [analysis, setAnalysis] = useState([
    {
      id:1,
      date:'10 jan 2025',
      analysis : 'today was a great day a productive one.'
    },
    {
      id:2,
      date:'12 jan 2025',
      analysis : 'today you were a little lazy guy'
    },
  ])
  return (
    <div>
      Analysis
      <ul>

      {analysis.map((itm)=>{
        return(
          <li>
            <Analysisbox date={itm.date} analysis={itm.analysis} />
          </li>
        )})}
        </ul>
    </div>
  )
}

export default Analysis
