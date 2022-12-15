import React from 'react';
import { Col, Form, Modal } from 'antd';
import getComponent from '@/components/PityForm/index';

const { Item: FormItem } = Form;

const FormForModal = ({
  title,
  width,
  left,
  right,
  visible,
  onCancel,
  loading,
  offset = 0,
  record,
  fields,
  onFinish,
}) => {
  const [form] = Form.useForm();
  const onOk = () => {
    form.validateFields().then((values) => {
      onFinish(values);
    });
  };

  const layout = {
    labelCol: { span: left },
    wrapperCol: { span: right },
  };

  return (
    <Modal
      style={{ marginTop: offset }}
      confirmLoading={loading}
      title={title}
      width={width}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form} {...layout} initialValues={record} onFinish={onFinish}>
        {fields.map((item, index) => (
          <Col span={item.span || 24} key={index}>
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
        ))}
      </Form>
    </Modal>
  );
};

export default FormForModal;
