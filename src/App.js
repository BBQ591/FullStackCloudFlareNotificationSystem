import './App.css';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FixedSizeList as List } from 'react-window';

const Renderer = ({notification, style}) => {
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
        {new moment(notification.timestamp).format("DD MMM YYYY, h:mma")}
      </div>
    </div>
  )
}
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
      console.log("fetchingggg");
      try {
    //     const baseUrl = process.env.NODE_ENV === 'production' 
    // ? 'https://notification-system.pages.dev/api/notifications' 
    // : 'http://localhost:8787/api/notifications';
    const baseUrl = 'https://notification-system.pages.dev/api/notifications' ;
          const response = await fetch(baseUrl);
          // console.log(result);
          // console.log(response);
          // console.log(await response.json());
          console.log(baseUrl);
          console.log(response);
          setNotis((await response.json()).reverse().filter(notification => !notification.read));
      } catch (err) {
          console.log("HERE", err);
      }
  };

  fetchNotifications();

  const interval = setInterval(fetchNotifications, 4000); // 5000 ms = 5 seconds

  // Cleanup interval on component unmount
  return () => clearInterval(interval);
  }, [])

  const handleSend = async (e) => {
    e.preventDefault();

    // Replace with your API endpoint
    const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://notification-system.pages.dev/api/notifications' 
    : 'http://localhost:8787/api/notifications';

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        body: JSON.stringify({ "type": notiType, "content": {"text": message}, "read": false }), // Send the data as JSON
      });
      if (response.ok) {
        setMessage("");
        setnotiType('');
      }
      // console.log(JSON.parse(response));
    } catch (error) {
      console.error('Error:', error);
    }

  };
  const [notiType, setnotiType] = useState(null);
  

  return (
    <div className='container'>
      {/* <div style={{flex: 1, justifyContent:'center', alignItems:'center', display:'flex', textAlign:'center', height: "100vh" }}>
        <div style={{  border: "3px solid rgba(0, 0, 0, 0.05)", borderRadius:"10px", width: "100%", marginRight: "10px", marginLeft: "10px"}}> */}
        <form onSubmit={handleSend} id="notification-form">
          {/* <div id="div-notification"> */}
            <h1 style={{fontSize:30, fontFamily:'Patrick Hand, cursive'}}>Create Notification</h1>
                <textarea
                  type="text"
                  id="notification-message"
                  onChange={handleMessageChange}
                  value={message}
                  placeholder='Message...'
                  required
                />
                <select
                id="notification-type"
                value={notiType}
                onChange={handleNotiChange}
                required
                >
                <option value="alert">Alert</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
              </select>
              <p></p>
              <button
              type="submit"  // Event handler for button click
              id="send-notification-btn"
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'grey'} // Change color on hover
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'} // Revert color on mouse out
            >
              Send
            </button>
          {/* </div> */}

          </form>

        {/* </div> */}



      {/* // </div> */}


    {/* <div style={{flex:1, justifyContent:'center', alignItems:'center', display:'flex', height: "100vh" }}> */}

      {/* <div id="notification-feed"> */}
      <List id="notification-feed" style={{flex:1, width:'100%', border: '1px solid black', borderRadius:'10px'}} height={400} itemCount={notis.length} itemSize={80}>

        {({index, style}) => (
          <div style={style}>
          <Renderer notification={notis[index]}/>
          </div>
        )}
        
        </List>

      {/* </div> */}

    {/* </div> */}
    </div>
    
  );
}

export default App;