import './App.css';
import React, { useEffect, useState } from 'react';
import VirtualizedList from './VirtualizedList';


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
        const baseUrl ='https://notification-system.pages.dev/api/notifications' 
          const response = await fetch(baseUrl);
          // console.log(result);
          // console.log(response);
          // console.log(await response.json());
          console.log(baseUrl);
          console.log(response);
          setNotis((await response.json()).reverse());
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
    const baseUrl ='https://notification-system.pages.dev/api/notifications' 

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
            <h1>Create Notification</h1>
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
              onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#363636'; e.currentTarget.style.color = 'white'}} // Change color on hover
              onMouseOut={(e) => {e.currentTarget.style.backgroundColor = '#D3D3D3'; e.currentTarget.style.color = 'black'}} // Revert color on mouse out
            >
              Send
            </button>
          {/* </div> */}

          </form>

        {/* </div> */}



      {/* // </div> */}


    {/* <div style={{flex:1, justifyContent:'center', alignItems:'center', display:'flex', height: "100vh" }}> */}
      <VirtualizedList itemHeight={80} containerHeight={400} notis={notis}/>
        
    {/* </div> */}
    </div>
    
  );
}

export default App;