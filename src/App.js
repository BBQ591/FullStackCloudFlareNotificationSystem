import './App.css';
import React, { useEffect, useState } from 'react';
import moment from 'moment';



function App() {
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const handleNotiChange = (e) => {
    setnotiType(e.target.value);
  };


  const [notis, setNotis] = useState([])
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
          const response = await fetch('https://notification-system.pages.dev/api/notifications', {method: "GET",     headers: {
            'Authorization': `Bearer ${"Y4Co2sBTMykQ8E8B-kcpL0TD3RNzpxwiVbNZUzDx"}`,
            'Content-Type': 'application/json',
        }});
          // console.log(result);
          // console.log(response);
          // console.log(await response.json());
          console.log(response);
          setNotis((await response.json()).reverse());
      } catch (err) {
          console.log("HERE", err);
      }
  };

  fetchNotifications();
  }, [])

  const handleSend = async (e) => {
    e.preventDefault();

    // Replace with your API endpoint
    const apiUrl = 'https://notification-system.pages.dev/api/notifications';

    try {
      await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ "type": notiType, "content": {"text": message}, "read": false }), // Send the data as JSON
      });
      // console.log(JSON.parse(response));
    } catch (error) {
      console.error('Error:', error);
    }
    setMessage("");
    setnotiType('');
  };

  const [notiType, setnotiType] = useState('');
  

  return (
    <div className='container'>
      <div style={{flex: 1, justifyContent:'center', alignItems:'center', display:'flex', textAlign:'center', height: "100vh" }}>
          <form id="notification-form">
              <h1 style={{fontSize:30, fontFamily:'Patrick Hand, cursive'}}>Create Notification</h1>
              <textarea
                type="text"
                id="notification-message"
                onChange={handleMessageChange}
                value={message}
                placeholder='Message...'
              />
              <select
              id="notification-type"
              value={notiType}
              onChange={handleNotiChange}
              style={{ width: '50%', margin: '10px 0', borderRadius: 5, textAlign:'center', fontFamily:'Patrick Hand, cursive' }}
              >
              <option value="">--Message Type--</option>
              <option value="alert">Alert</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
            <p></p>
            <button
            onClick={handleSend}  // Event handler for button click
            id="sent-notification-btn"
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'grey'} // Change color on hover
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'} // Revert color on mouse out
          >
            Send
          </button>
          </form>


      </div>


    <div style={{flex:1, justifyContent:'center', alignItems:'center', display:'flex', height: "100vh" }}>
      <div id="notification-feed">
        {notis.map((notification) => {
          let color = "#ffcccb";
          if (notification.type === "success") {
            color = "#90ee90";
          }
          else if (notification.type === "info") {
            color = "#add8e6";
          }
    return (
      <div key={notification.id} className="notification-card" style={{backgroundColor: color}}>
        <p className="notification-message">{notification.content.text}</p>
        <div className="notification-timestamp">
          <p>{new moment(notification.timestamp).format("DD MMM YYYY, h:mma")}</p>
        </div>
      </div>
    )})
        }

      </div>
        
    </div>
    </div>
    
  );
}

export default App;