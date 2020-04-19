import React from 'react';
import './Window.css';

function Window() {
  return (
    <div className="container">
      <div className="row">
        <div className="column left">
          <span className="dot" style={{ background: '#ED594A' }}></span>
          <span className="dot" style={{ background: '#FDD800' }}></span>
          <span className="dot" style={{ background: '#5AC05A' }}></span>
        </div>
        <div className="column middle">
          <input
            className="domain"
            type="text"
            value="https://www.gmail.com"
            readOnly
          />
        </div>
      </div>

      <div className="content" style={{ textAlign: 'center' }}>
        <h3>Your next class INFO 2020 will start in 10 minutes at 1:25 PM</h3>
        <p>
          Zoom Link:
          <a href="https://cornell.zoom.us/j/313202005">
            {' '}
            https://cornell.zoom.us/j/710144471?pwd=YjlNQVlJbURoeG
          </a>
        </p>
      </div>
    </div>
  );
}

export default Window;
