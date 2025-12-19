import React from "react";
import { useState } from "react";
import Notesbox from '../components/Notesbox'
const Notes = () => {
  const [notes, setNotes] = useState([
  {
    id: 1,
    subject: "English",
    topic: "Grammer",
    content: "there are two types of conjunction.",
  },
  {
    id: 2,
    subject: "Maths",
    topic: "Algebra",
    content:
      "a plus b whole square is equal to a square plus b square plus two a b.",
  },
]);
  return (
    <div>
      Notes
      <ul>
        {notes.map((itm) => {
          return(
          <li key={itm.id}><Notesbox subject={itm.subject} topic={itm.topic} content={itm.content}/></li>
        )})}
      </ul>
    </div>
  );
};

export default Notes;
