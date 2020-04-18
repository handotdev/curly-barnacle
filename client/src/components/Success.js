import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Tooltip, Modal, message as Message } from 'antd';
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
            console.log(linksArray);
            if (linksArray.length > 0) {
                const requestPromises = [];

                linksArray.forEach(([className, meetingID]) => {
                    const splitName = className.split('-');
                    const course = splitName[0];
                    const section = splitName[1];

                    // Account for errors where the meetingid is empty
                    if (meetingID.length > 0) {
                        // Replace dashes in meeting IDs
                        const zoomLink = `https://cornell.zoom.us/j/${meetingID.replace(/-/g,'')}`;
                        requestPromises.push(axios.get(`/api/addLink?course=${course}&section=${section}&link=${zoomLink}`));
                    }
                })

                Promise.all(requestPromises).then(res => {
                    // Hide after clicking button and success
                    props.hideSuccess();
                    Message.success(`Successfully added links to ${requestPromises.length} ${requestPromises.length === 1 ? 'class' : 'classes'}`);
                    // Clear links
                    setLinks({});
                }).catch(err => {
                    Message.error(`Unable to add links right now. Try again later`);
                    console.log(err);
                })
            } else {
                Message.info(`At least one link is required to save`);
            }
        }

        return (
            <Modal
                visible={props.visible}
                title={<span><CheckCircleTwoTone twoToneColor="#52c41a" /> Successfully signed up with {props.email}</span>}
                closable={false}
                maskClosable={false}
                cancelText= "No Thanks"
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
                rules={[
                    {
                      pattern: /[\w\d\-]{8,13}/gi,
                      message: 'Please enter a valid Zoom meeting ID',
                    },
                  ]}
                >
                <Input 
                    placeholder="9 - 11 digit meeting ID"
                    onChange={(e) => setLinks({...links, [`${classInfo.course}-${classInfo.section}`]: e.target.value })}
                />
                </Form.Item>
            )}) }

        </Form>
        </Modal>
        );
}

export default Success;