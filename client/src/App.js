import { useEffect, useState } from 'react';
import Authorized from './routes/Authorized';
import Unauthorized from './routes/Unauthorized';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(
    () => {
      if (localStorage.getItem("vmail_user")) {
        const localStorageUser = JSON.parse(localStorage.getItem("vmail_user"));
        if (user && localStorageUser.id !== user.id) {
          localStorage.removeItem('vmail_user');
          localStorage.setItem("vmail_user", JSON.stringify(user));
          setUser(JSON.parse(localStorage.getItem("vmail_user")));
        } else {
          setUser(JSON.parse(localStorage.getItem("vmail_user")));
        }
      }
    }, []
  );

  if (user === null) {
    return (<div className='app'><Unauthorized setLogin={setUser} /></div>);
  }

  return (<div className='app'><Authorized authdUser={user} /></div>);
}

export default App;
