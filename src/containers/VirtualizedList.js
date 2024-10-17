import '../App.css';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

function VirtualizedList() {
    //holds all the notifications
    const [notifications, setNotifications] = useState([])


    // fetching data from kv
    useEffect(() => {
      //notification fetching function
      const fetchNotifications = async () => {
        try {
          const url ='https://notification-system.pages.dev/api/notifications' 
          const response = await fetch(url);
          setNotifications((await response.json()).reverse());
        } catch (err) {
            console.log("FETCHING IS NOT WORKING: ", err);
        }
      };
      fetchNotifications();

      //interval to make sure that a fetch request is made every 4 seconds
      const interval = setInterval(fetchNotifications, 4000);
      return () => clearInterval(interval);
    }, [])

    //notificationHeight represents the height of each notification box
    //this is 80 pixels because the notification card is 70 pixels but there needs to be padding between the cards
    const notificationHeight = 80;

    //windowHeight is the height of the window of the notification feed
    const windowHeight = 400;


    //standard virtualized list code

    //scrollTop is how far the user has scrolled
    const [scrollTop, setScrollTop] = useState(0);

    //finding start and end indexes to show in the window
    const startIndex = Math.floor(scrollTop / notificationHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(windowHeight / notificationHeight),
      notifications.length
    );
    const visibleNotifications = notifications.slice(startIndex, endIndex);

    //padding to make sure that the form is correctly rendering the heights of the notification
    const invisibleNotificationHeight = (startIndex + visibleNotifications.length - endIndex) * notificationHeight;


    return (
      <div id="notification-feed" onScroll={(e) => setScrollTop(e.target.scrollTop)}>
        <div style={{ height: `${notifications.length * notificationHeight}px` }}>
          <div style={{position: "relative", height: `${visibleNotifications.length * notificationHeight}px`, top: `${startIndex * notificationHeight}px`}}>
            {visibleNotifications.map((notification) => {
                //setting color of the notification
                let color;
                if (notification.type === 'alert') {
                    color = "#ffcccb";
                }
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
                )})
            }
          </div>
          <div style={{ height: `${invisibleNotificationHeight}px` }} />
        </div>
      </div>
    );
}

export default VirtualizedList;