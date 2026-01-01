import React from 'react'
import { collection, getDocs, query, orderBy } from "firebase/firestore";
const Session = () => {
  const [sessions, setSessions] = useState(null)
  const fetchSessions = async (user) => {
  const sessionsRef = collection(db, "users", user.uid, "sessions");
  const q = query(sessionsRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  const sessions = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  setSessions(sessions);
};
  return (
    <div>
      Section
    </div>
  )
}

export default Session
