// Here's to 100 commits and a badass project

import React from 'react';
import * as firebase from 'firebase/app'
import "firebase/analytics";
import { Layout, Divider } from 'antd';
import { BellTwoTone } from '@ant-design/icons';
import Window from './components/Window';
import Fields from './components/Fields';
import * as dotenv from 'dotenv'

import './App.css';

dotenv.config()
const analytics = firebase.analytics;
const firebaseConfig = JSON.parse(process.env.FBCONFIG)

firebase.initializeApp(firebaseConfig)

const { Header, Content, Footer } = Layout;

analytics().setCurrentScreen(window.location.pathname) // sets `screen_name` parameter
analytics().logEvent('screen_view') // log event with `screen_name` parameter attached

function App() {
  return (
    <div>
      <Layout className="layout">
        <Header style={{ color: '#FFF', fontSize: '16px' }}>Cornell Notifs</Header>
        <Content>
          <div
            className="site-layout-content"
            style={{ padding: '25px 50px 85px 50px' }}
          >
            <h1>
              <BellTwoTone /> Receive email reminders with Zoom invites to your
              classes
            </h1>
            {/* Add Product Info */}
            <Window />
            <Divider>Sign Up</Divider>
            <Fields />
          </div>
        </Content>
      </Layout>
      <Footer
        style={{
          textAlign: 'center',
          width: '100%',
          position: 'fixed',
          bottom: '0',
        }}
      >
        Built with ❤️ by Ansh Godha & Han Wang wishing everyone well in these uncertain times
      </Footer>
    </div>
  );
}

export default App;
