import React, { Component } from 'react';
import axios from 'axios';
import { Form, Input, Button, Tooltip, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import './Fields.css';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { span: 0 },
};

export class Fields extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      url: '',
      loading: false,
    };
  }

  onFinish = () => {
    // Set state for loading for button spinner
    this.setState({ loading: true });

    const { email, url } = this.state;
    const key = '/shared/schedule/';

    const keyIndex = url.indexOf(key);
    const idIndex = keyIndex + key.length;

    const schedulerId = url.substring(idIndex);

    // Retrieve schedule info from API
    axios
      .get(`http://localhost:5000/api/schedule?email=${email}&id=${schedulerId}`)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.success) {
          message.success(`Successfully signed up with ${this.state.email}`);
          console.log(res.data.data);
        } else {
          const errorMsg = (res.data.message) ? res.data.message : 'Enable to sign up at the moment. Please try again later'
          message.error(errorMsg);
        }
      })
      .catch(() => {
        this.setState({ loading: false });
        message.error(
          'Enable to sign up at the moment. Please try again later'
        );
      });
  };

  render() {
    return (
      <Form
        {...layout}
        style={{ marginTop: '24px' }}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={this.onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          style={{ textAlign: 'left' }}
          rules={[
            { required: true, message: 'Email field cannot be empty' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input
            placeholder="hyw2@cornell.edu"
            onChange={(e) => this.setState({ email: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="Schedule URL"
          name="url"
          style={{ textAlign: 'left' }}
          rules={[
            { required: true, message: 'URL field cannot be empty' },
            {
              pattern: /(https?:\/\/)?(www\.)?classes\.cornell\.edu\/shared\/schedule\/(sp|su|fa|wi)[1-2][0-9]\/.......+/gi,
              message: 'Please enter a valid shared schedule URL',
            },
          ]}
        >
          <Input
            placeholder="https://classes.cornell.edu/shared/schedule/SP20/92eac951cf5b329be2522a9829421833"
            onChange={(e) => this.setState({ url: e.target.value })}
            suffix={
              <Tooltip
                title={
                  <p style={{ margin: '0' }}>
                    Visit{' '}
                    <a
                      href="https://classes.cornell.edu/scheduler/roster/SP20"
                      target="_blank"
                    >
                      Scheduler
                    </a>{' '}
                    and click 'Share'
                  </p>
                }
              >
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={this.state.loading}>
            {this.state.loading ? 'Loading' : 'Submit'}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Fields;
