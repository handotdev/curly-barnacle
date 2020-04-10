import React from 'react';

import { Layout, Form, Input, Button } from 'antd';
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
      <Header style={{color: '#FFF'}}>
        Zoom University@Cornell
      </Header>
      <Content>
        <div className="site-layout-content" style={{padding: '25px 50px'}}>
        
        {/* Add Product Info */}
        <Window />

        <Form
        {...layout}
        style={{marginTop: '24px'}}
        name="basic"
        initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter a valid schedule link!' }]}
        >
          <Input
            placeholder="hyw2@cornell.edu"
          />
        </Form.Item>
        <Form.Item
          label="Schedule URL"
          name="link"
          rules={[{ required: true, message: 'Please enter a valid schedule link!' }]}
        >
          <Input
            placeholder="https://classes.cornell.edu/shared/schedule/SP20/92eac951cf5b329be2522a9829421833"
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
    <Footer style={{ textAlign: 'center', width: '100%', position: 'fixed', bottom: '0' }}>Built with ❤️ by Ansh Godha & Han Wang wishing everyone the best!</Footer>
    </div>
  );
}

export default App;
