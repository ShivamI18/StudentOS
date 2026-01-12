import React from 'react'
import { Link } from 'react-router-dom'
const Help = () => {
  return (
    <div>
      <div>Why do we need usage access premission?</div>
      <div>StudentOS need this premission to track your app usage data nothing else.</div>
      <div>How to enable usage access premission?</div>
      <div>Open setting - search you usage access - allow it for studentos app - reopen the app - Click Refresh Usage Data.</div>
      <div>If any other problem please visit our <Link to={'https://github.com/ShivamI18/StudentOS/blob/main/README.md'}>Github Repo</Link></div>
    </div>
  )
}

export default Help
