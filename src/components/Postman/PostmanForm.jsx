import React, { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  Radio,
  Row,
  Select,
  Table,
  Tabs,
} from 'antd';
import { DownOutlined, SendOutlined } from '@ant-design/icons';
import { notification } from '_antd@4.24.3@antd';
import { httpRequest } from '@/services/request';
import auth from '@/utils/auth';
import EditableTable from '@/components/Table/EditableTable';
import { DeleteTwoTone } from '_@ant-design_icons@4.8.0@@ant-design/icons';
import CodeEditor from '@/components/Postman/CodeEditor';

const { Option } = Select;
const { TabPane } = Tabs;

//状态码样式和文案
const STATUS = {
  200: { color: '#67C23A', text: 'OK' },
  401: { color: '#F56C6C', text: 'unauthorized' },
  400: { color: '#F56C6C', text: 'Bad Request' },
};

// 状态码和响应时间组件
const tabExtra = (response) => {
  return response && response.response ? (
    <div style={{ marginRight: 16 }}>
      <span>
        Status:
        <span
          style={{
            color: STATUS[response.status_code] ? STATUS[response.status_code].color : '#F56C6C',
            marginLeft: 8,
            marginRight: 8,
          }}
        >
          {response.status_code}
          {STATUS[response.status_code] ? STATUS[response.status_code].text : ''}
        </span>
        <span style={{ marginLeft: 8, marginRight: 8 }}>
          Time:<span style={{ color: '#67C23A' }}>{response.elapsed}</span>
        </span>
      </span>
    </div>
  ) : null;
};

export default ({ form, body, setBody, headers, setHeaders }) => {
  //请求方式数据
  const [method, setMethod] = useState('GET');
  // 请求url+params
  const [url, setUrl] = useState('');
  //params数据
  const [paramsData, setParamsData] = useState([]);
  //params表单,正在编辑的行，受控属性。 默认 key 会使用 rowKey 的配置，如果没有配置会使用 index，建议使用 rowKey
  const [editableKeys, setEditableRowKeys] = useState(() => paramsData.map((item) => item.id));
  //header表单,正在编辑的行，受控属性。 默认 key 会使用 rowKey 的配置，如果没有配置会使用 index，建议使用 rowKey
  const [headersKeys, setHeadersKeys] = useState(() => headers.map((item) => item.id));
  //是否loading数据，默认为false
  const [loading, setLoading] = useState(false);
  //接口返回结果数据
  const [response, setResponse] = useState({});
  //bodyType,body的类型,默认为none
  const [bodyType, setBodyType] = useState('none');
  //raw下拉菜单类型，默认为JSON
  const [rawType, setRawType] = useState('JSON');

  //根据paramsData拼接url
  const joinUrl = (data) => {
    let tempUrl = url.split('?')[0];
    data.forEach((item, idx) => {
      // 如果item.key有效
      if (item.key) {
        if (idx === 0) {
          tempUrl = `${tempUrl}?${item.key}=${item.value || ''}`;
        } else {
          tempUrl = `${tempUrl}&${item.key}=${item.value || ''}`;
        }
      }
    });
    // setUrl(tempUrl);设置表单的值
    form.setFieldsValue({ url: tempUrl });
  };

  //url拆分，拆分Params
  const splitUrl = (nowUrl) => {
    const split = nowUrl.split('?');
    if (split.length < 2) {
      setParamsData([]);
    } else {
      const params = split[1].split('&');
      const newParams = [];
      const keys = [];
      params.forEach((item, idx) => {
        const [key, value] = item.split('=');
        const now = Date.now();
        keys.push(now + idx + 10);
        newParams.push({ key, value, id: now + idx + 10, description: '' });
      });
      setParamsData(newParams);
      setEditableRowKeys(keys);
    }
  };

  // 处理headers
  const getHeaders = () => {
    const result = {};
    headers.forEach((item) => {
      if (item.key !== '') {
        result[item.key] = item.value;
      }
    });
    return result;
  };

  //拼接http请求
  const onRequest = async () => {
    if (url === '') {
      notification.error({
        message: '请求Url不能为空',
      });
      return;
    }
    setLoading(true);
    const params = {
      method,
      url,
      body,
      headers: getHeaders(),
    };
    if (bodyType === 'none') {
      params.body = null;
    }
    const res = await httpRequest(params);
    setLoading(false);
    if (auth.response(res, true)) {
      setResponse(res.data);
    }
  };

  // 根据key删除行
  const onDelete = (columnType, key) => {
    if (columnType === 'params') {
      const data = paramsData.filter((item) => item.id !== key);
      setParamsData(data);
      joinUrl(data);
    } else {
      const data = headers.filter((item) => item.id !== key);
      setHeaders(data);
    }
  };

  // raw下拉菜单点击事件
  const onClickMenu = (key) => {
    setRawType(key);
  };

  //raw下拉菜单组件
  const menu = (
    <Menu>
      <Menu.Item key="Text">
        <a
          onClick={() => {
            onClickMenu('Text');
          }}
        >
          Text
        </a>
      </Menu.Item>
      <Menu.Item key="JavaScript">
        <a
          onClick={() => {
            onClickMenu('JavaScript');
          }}
        >
          JavaScript
        </a>
      </Menu.Item>
      <Menu.Item key="JSON">
        <a
          onClick={() => {
            onClickMenu('JSON');
          }}
        >
          JSON
        </a>
      </Menu.Item>
      <Menu.Item key="HTML">
        <a
          onClick={() => {
            onClickMenu('HTML');
          }}
        >
          HTML
        </a>
      </Menu.Item>
      <Menu.Item key="XML">
        <a
          onClick={() => {
            onClickMenu('XML');
          }}
        >
          XML
        </a>
      </Menu.Item>
    </Menu>
  );

  //params参数列表
  const columns = (columnType) => {
    return [
      {
        title: 'KEY',
        key: 'key',
        dataIndex: 'key',
      },
      {
        title: 'VALUE',
        key: 'value',
        dataIndex: 'value',
      },
      {
        title: 'DESCRIPTION',
        key: 'description',
        dataIndex: 'description',
      },
      {
        title: '操作',
        valueType: 'option',
        render: (text, record) => (
          <DeleteTwoTone
            style={{ cursor: 'pointer', marginLeft: 20 }}
            onClick={() => {
              onDelete(columnType, record.record.id);
            }}
          />
        ),
      },
    ];
  };

  //response的Cookie和Headers参数列表
  const resColumns = [
    {
      title: 'KEY',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'VALUE',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  //根据类型获取response中对应的数据
  const toTable = (field) => {
    if (!response[field]) {
      return [];
    }
    return Object.keys(response[field]).map((key) => ({
      key,
      value: response[field][key],
    }));
  };

  return (
    <Card>
      <Form form={form}>
        <Row gutter={[8, 8]}>
          <Col span={20}>
            {/*请求方式*/}
            <Form layout="inline" form={form}>
              <Col span={6}>
                <Form.Item
                  name="request_method"
                  rules={[{ required: true, message: '请选择请求方法' }]}
                >
                  <Select
                    value={method}
                    placeholder="选择请求方式"
                    onChange={(data) => {
                      setMethod(data);
                    }}
                    style={{ width: 120, textAlign: 'left' }}
                  >
                    <Option value="GET">GET</Option>
                    <Option value="POST">POST</Option>
                    <Option value="PUT">PUT</Option>
                    <Option value="DELETE">DELETE</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={18}>
                {/*输入框*/}
                <Form.Item name="url" rules={[{ required: true, message: '请输入请求url' }]}>
                  <Input
                    value={url}
                    placeholder="请输入要请求的url"
                    onChange={(e) => {
                      setUrl(e.target.value);
                      splitUrl(e.target.value);
                    }}
                  />
                </Form.Item>
              </Col>
            </Form>
          </Col>
          <Col span={4}>
            <Button
              onClick={onRequest}
              loading={loading}
              type="primary"
              style={{ marginRight: 16, float: 'right' }}
            >
              <SendOutlined />
              Send{' '}
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 8 }}>
          <Tabs defaultActiveKey="1" style={{ width: '100%' }}>
            <TabPane tab="Params" key="1">
              <EditableTable
                columns={columns('params')}
                title="Query Params"
                dataSource={paramsData}
                setDataSource={setParamsData}
                extra={joinUrl}
                editableKeys={editableKeys}
                setEditableRowKeys={setEditableRowKeys}
              />
            </TabPane>
            <TabPane tab="Headers" key="2">
              <EditableTable
                columns={columns('headers')}
                title="Headers"
                dataSource={headers}
                setDataSource={setHeaders}
                editableKeys={headersKeys}
                setEditableRowKeys={setHeadersKeys}
              />
            </TabPane>
            <TabPane tab="Body" key="3">
              <Row>
                <Radio.Group
                  defaultValue="none"
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                >
                  <Radio value="none">none</Radio>
                  <Radio value="form-data">form-data</Radio>
                  <Radio value="x-www-form-urlencoded">x-www-form-urlencoded</Radio>
                  <Radio value="raw">raw</Radio>
                  <Radio value="binary">binary</Radio>
                  <Radio value="GraphQL">GraphQL</Radio>
                </Radio.Group>
                {bodyType === 'raw' ? (
                  <Dropdown style={{ marginLeft: 8 }} overlay={menu} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                      {rawType}
                      <DownOutlined />
                    </a>
                  </Dropdown>
                ) : null}
              </Row>
              {bodyType !== 'none' ? (
                <Row style={{ marginTop: 12 }}>
                  <Col span={24}>
                    <Card bodyStyle={{ padding: 0 }}>
                      <CodeEditor value={body} setValue={setBody} height="20vh" />
                    </Card>
                  </Col>
                </Row>
              ) : (
                <div style={{ height: '20vh', lineHeight: '20vh', textAlign: 'center' }}>
                  This request does not have a body
                </div>
              )}
            </TabPane>
          </Tabs>
        </Row>
        <Row gutter={[8, 8]}>
          {Object.keys(response).length === 0 ? null : (
            <Tabs style={{ width: '100%' }} tabBarExtraContent={tabExtra(response)}>
              <TabPane tab="body" key="1">
                <CodeEditor
                  value={response.response ? JSON.stringify(response.response, null, 2) : ''}
                  height="30vh"
                />
              </TabPane>
              <TabPane tab="Cookie" key="2">
                <Table
                  columns={resColumns}
                  dataSource={toTable('cookies')}
                  size="small"
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="Headers" key="3">
                <Table
                  columns={resColumns}
                  dataSource={toTable('response_headers')}
                  size="small"
                  pagination={false}
                />
              </TabPane>
            </Tabs>
          )}
        </Row>
      </Form>
    </Card>
  );
};
