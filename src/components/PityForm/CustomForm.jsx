import React from 'react';
import { Button, Col, Form, Modal, Row } from 'antd';
import getComponent from '@/components/PityForm/index';
import { Tooltip, Upload } from '_antd@4.24.3@antd';
import ProjectAvatar from '@/components/Project/ProjectAvatar';
import { SaveOutlined } from '@ant-design/icons';

const { Item: FormItem } = Form;

export default ({ left, right, record, fields, onFinish }) => {
  const [form] = Form.useForm();

  const layout = {
    labelCol: { span: left },
    wrapperCol: { span: right },
  };

  return (
    <Form form={form} {...layout} initialValues={record} onFinish={onFinish}>
      <Row>
        <Col span={6} />
        <Col span={12} style={{ textAlign: 'center', margin: 'auto' }}>
          <Row style={{ textAlign: 'center', marginBottom: 16 }}>
            <ProjectAvatar data={record} />
          </Row>
        </Col>
        <Col span={6} />
      </Row>
      {fields.map((item) => (
        <Row>
          <Col span={6} />
          <Col span={12}>
            <FormItem
              label={item.label}
              colon={item.colon || true}
              initialValue={item.initialValue}
              name={item.name}
              valuePropName={item.valuePropName || 'value'}
              rules={[
                {
                  required: item.required,
                  message: item.message,
                },
              ]}
            >
              {getComponent(item.type, item.placeholder, item.component)}
            </FormItem>
          </Col>
          <Col span={6} />
        </Row>
      ))}
      <Row>
        <Col span={6} />
        <Col span={12} style={{ textAlign: 'center' }}>
          <FormItem
            {...{
              labelCol: { span: 0 },
              wrapperCol: { span: 24 },
            }}
          >
            <Button htmlType="submit" type="primary">
              <SaveOutlined />
              修改
            </Button>
          </FormItem>
        </Col>
        <Col span={6} />
      </Row>
    </Form>
  );
};
