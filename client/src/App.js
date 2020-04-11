import React from 'react';
import { Layout, Divider } from 'antd';
import { BellTwoTone } from '@ant-design/icons';

import Window from './components/Window';
import Fields from './components/Fields';

import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <div>
      <Layout className="layout">
        <Header style={{ color: '#FFF' }}>Zoom University@Cornell</Header>
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
