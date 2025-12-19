import React from 'react'
import { useState } from 'react'
import Sessionbox from '../components/Sessionbox'
const Session = () => {
    const [sessions, setSessions] = useState([
        {
            id:1,
            subject : 'English',
            analysis : 'Had a great study time. need to read more books',
            notes : 'john is a boy.'
        },
        {
            id:2,
            subject : 'Maths',
            analysis : 'Need spend more time of calculus.',
            notes : 'Integration is hard.'
        }
    ])

  return (
    <div>
      Session 
      <ul>

      {sessions.map((itm) => {
        return(
          <li key={itm.id}>
            <Sessionbox subject={itm.subject} analysis={itm.analysis} notes={itm.notes} />
          </li>
        )})}
    </ul>
    </div>
  )
}

export default Session
