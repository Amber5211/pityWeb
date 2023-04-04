import React, { useState } from 'react';
import { Form, Drawer, Button, Row, Col } from 'antd';
import CaseDetail from '@/components/Drawer/CaseDetail';
import getComponent from '@/components/PityForm/index';
import PostmanForm from '@/components/Postman/PostmanForm';

const { Item: FormItem } = Form;

export default ({
  title,
  left,
  right,
  width,
  formName,
  record,
  onFinish,
  loading = true,
  fields,
  onCancel,
  visible,
}) => {
  //创建 Form 实例，用于管理所有数据状态。
  const [form] = Form.useForm();
  //请求头数据
  const [headers, setHeaders] = useState([]);
  //请求体数据
  const [body, setBody] = useState('');

  //新增用例提交
  const onOk = () => {
    //form.validateFields触发表单验证
    form.validateFields().then((values) => {
      onFinish({ ...values, request_header: translateHeaders(), body });
    });
  };

  //请求头数据转化成json
  const translateHeaders = () => {
    const hd = {};
    for (const h in headers) {
      hd[headers[h].key] = headers[h].value;
    }
    return JSON.stringify(hd, null, 2);
  };
  //表单布局
  const layout = {
    labelCol: { span: left },
    wrapperCol: { span: right },
  };

  return (
    <Drawer
      destroyOnClose //关闭时销毁 Drawer 里的子元素
      confirmLoading={loading}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button
            onClick={() => {
              onCancel();
              form.resetFields(); //重置表单字段
            }}
            style={{ marginRight: 8 }}
          >
            取消
          </Button>
          <Button onClick={onOk}>提交</Button>
        </div>
      }
      title={title}
      width={width}
      visible={visible}
      onOk={onOk}
      onCancel={() => {
        onCancel();
        form.resetFields(); //重置表单字段
      }}
      onClose={() => {
        onCancel();
        form.resetFields();
      }}
    >
      <h3 style={{ borderLeft: '3px solid #ecb64a', padding: '3px 8px' }}>用例信息</h3>
      <Form form={form} {...layout} name={formName} initialValues={record} onFinish={onFinish}>
        <Row gutter={[8, 8]}>
          {fields.map((item) => (
            <Col span={item.span || 24} key={item.name}>
              <FormItem
                label={item.label}
                colon={item.colon || true}
                rules={[{ required: item.required, message: item.message }]}
                name={item.name}
                valuePropName={item.valuePropName || 'value'}
                key={item.name}
              >
                {getComponent(item.type, item.placeholder, item.component)}
              </FormItem>
            </Col>
          ))}
        </Row>
        <Row gutter={[8, 8]}>
          <h3 style={{ borderLeft: '3px solid #ecb64a', padding: '3px 8px' }}>请求信息</h3>
          <Col span={24}>
            <PostmanForm
              form={form}
              body={body}
              setBody={setBody}
              headers={headers}
              setHeaders={setHeaders}
            />
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};
