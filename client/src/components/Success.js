import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Tooltip, Modal } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';

const completeLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

export function Success(props) {

        const [form] = Form.useForm();
        const [links, setLinks] = useState({});

        const addLinks = () => {
            const linksArray = Object.entries(links);
            const requestPromises = [];

            linksArray.forEach(([className, meetingID]) => {
                const splitName = className.split('-');
                const course = splitName[0];
                const section = splitName[1];

                // Replace dashes in meeting IDs
                const zoomLink = `https://cornell.zoom.us/j/${meetingID.replace(/-/g,'')}`;

                requestPromises.push(axios.get(`/api/addLink?course=${course}&section=${section}&link=${zoomLink}`));
            })

            Promise.all(requestPromises).then(res => {
                console.log("Added links");
            }).catch(err => {
                console.log(err);
            })
        }

        return (
            <Modal
                visible={props.visible}
                title={<span><CheckCircleTwoTone twoToneColor="#52c41a" /> Successfully signed up with hyw2@cornell.edu</span>}
                cancelText= "Skip"
                okText= 'Save'
                onOk={() => form.submit()}
                onCancel={props.hideSuccess}
            >
            <Form
                form={form}
                {...completeLayout}
                name="addLinks"
                onFinish={addLinks}
            >
            <Form.Item>We identified classes in your schedule that we don't currently have Zoom links for. Save your Zoom meeting IDs so we can send them to you before classes!</Form.Item>
            <Form.Item>
            <Tooltip title={<span>Access your class on <a href="https://canvas.cornell.edu/" target="_blank">Canvas</a> > Zoom > Meeting ID (e.g. 982-252-173)</span>}>
                <strong>How do I get my Zoom meeting IDs?</strong>
            </Tooltip>
            </Form.Item>
            { props.classes.map((classInfo) => {
                return (
                <Form.Item
                label={`${classInfo.course} - ${classInfo.section}`}
                name={`${classInfo.course}-${classInfo.section}`}
                rules={[{ required: true, message: 'Please input your username!' }]}
                >
                <Input 
                    onChange={(e) => setLinks({...links, [`${classInfo.course}-${classInfo.section}`]: e.target.value })}
                />
                </Form.Item>
            )}) }

        </Form>
        </Modal>
        );
}

export default Success;