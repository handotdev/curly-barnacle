import React, { Component } from 'react';
import { Form, Input, Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import './Fields.css';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
const tailLayout = {
    wrapperCol: { span: 0 }
};

export class Fields extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            url: ""
        }
    }

    onFinish = () => {
        console.log(this.state.email);
        console.log(this.state.url);
    }

    render() {

        const validateEmail = () => {
            console.log("Validating: ");
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return !emailRegex.test(this.state.email.toLowerCase());
        }

        return (
            <Form
                {...layout}
                style={{ marginTop: '24px' }}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
            // onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    style={{ textAlign: 'left' }}
                    rules={[{ required: validateEmail, message: 'Please enter a valid email' }]}
                >
                    <Input
                        placeholder="hyw2@cornell.edu"
                        onChange={e => this.setState({ email: e.target.value })}
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
                        onChange={e => this.setState({ url: e.target.value })}
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
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        Submit
            </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Fields
