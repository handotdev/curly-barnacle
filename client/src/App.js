import React from 'react';

import { Layout, Form, Input, Button, Divider, Tooltip } from 'antd';
import { InfoCircleOutlined, BellTwoTone } from '@ant-design/icons';

import './App.css';

import Window from './components/Window';

const { Header, Content, Footer } = Layout;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { span: 0 }
};

function App() {
  return (
    <div>
      <Layout className="layout">
        <Header style={{ color: '#FFF' }}>
          Zoom University@Cornell
        </Header>
        <Content>
          <div className="site-layout-content" style={{ padding: '25px 50px 85px 50px' }}>

            <h1><BellTwoTone /> Receive email reminders with Zoom invites to your classes automatically</h1>
            {/* Add Product Info */}
            <Window />
            <Divider>Sign Up</Divider>
            <Form
              {...layout}
              style={{ marginTop: '24px' }}
              name="basic"
              initialValues={{ remember: true }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Email"
                name="email"
                style={{ textAlign: 'left' }}
                rules={[{ required: true, message: 'Please enter a valid email' }]}
              >
                <Input
                  placeholder="hyw2@cornell.edu"
                />
              </Form.Item>
              <Form.Item
                label="Schedule URL"
                name="link"
                style={{ textAlign: 'left' }}
                rules={[{ required: true, message: 'Please enter a valid schedule link' }]}
              >
                <Input
                  placeholder="https://classes.cornell.edu/shared/schedule/SP20/92eac951cf5b329be2522a9829421833"
                  suffix={
                    <Tooltip title={<p style={{ margin: '0' }}>Visit <a href="https://classes.cornell.edu/scheduler/roster/SP20" target="_blank">Scheduler</a> and click 'Share'</p>}>
                      <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                  }
                />
              </Form.Item>
              <Form.Item
                {...tailLayout}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center', width: '100%', position: 'fixed', bottom: '0' }}>Built with ❤️ by Ansh Godha & Han Wang wishing everyone well in these uncertain times</Footer>
    </div>
  );
}

export default App;
