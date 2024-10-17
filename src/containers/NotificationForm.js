import '../App.css';
import React, { useState } from 'react';

function NotificationForm() {
    //this stores the type of the notification (alert, success, info)
    const [notificationType, setnotificationType] = useState("alert");

    //this stores the message in the textArea of the form
    const [message, setMessage] = useState('');

    //this function is called when the form is submitted
    const handleSend = async (e) => {
        //prevents refresh
        e.preventDefault();
        const url ='https://notification-system.pages.dev/api/notifications' 
        try {
          const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ "type": notificationType, "content": {"text": message}, "read": false }),
          });
          //makes sure that the post request was valid
          if (response.ok) {
            setMessage("");
            setnotificationType("alert");
          }
        } catch (error) {
          console.error("POST REQUEST NOT WORKING: ", error);
        }
    
      };
    return (
        <form onSubmit={handleSend} id="notification-form">

          <h1>Create Notification</h1>

          <textarea
            type="text"
            id="notification-message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder='Message...'
            required
          />

          <select
            id="notification-type"
            value={notificationType}
            onChange={(e) => setnotificationType(e.target.value)}
            required
          >
            <option value="alert">Alert</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
          </select>

          <button
          type="submit"
          id="send-notification-btn"
          //when the mouse is hovering, make the button turn dark and text turn white
          onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#363636'; e.currentTarget.style.color = 'white';}}

          //when the mouse is exiting the buttons area, make it turn lighter again and the text turn black
          onMouseOut={(e) => {e.currentTarget.style.backgroundColor = '#D3D3D3'; e.currentTarget.style.color = 'black';}}
        >
          Send
        </button>
      </form>
    );
}

export default NotificationForm;