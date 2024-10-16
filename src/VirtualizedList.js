import './App.css';
import React, { useState } from 'react';
import moment from 'moment';

function VirtualizedList({ itemHeight, containerHeight, notis }) {
    const [scrollTop, setScrollTop] = useState(0);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      notis.length
    );
    const visibleItems = notis.slice(startIndex, endIndex);
    const invisibleItemsHeight = (startIndex + visibleItems.length - endIndex) * itemHeight;
    const handleScroll = (event) => {
      setScrollTop(event.target.scrollTop);
    };
    return (
      <div
        id="notification-feed"
        onScroll={handleScroll}
      >
        <div style={{ height: `${notis.length * itemHeight}px` }}>
          <div
            style={{
              position: "relative",
              height: `${visibleItems.length * itemHeight}px`,
              top: `${startIndex * itemHeight}px`,
            }}
          >
            {visibleItems.map((notification) => {
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
          )})
        }
          </div>
          <div style={{ height: `${invisibleItemsHeight}px` }} />
        </div>
      </div>
    );
}

export default VirtualizedList;