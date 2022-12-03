import React, { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Input,
  Select,
  Button,
  Tabs,
  Radio,
  Menu,
  Dropdown,
  notification,
  Modal,
  Table,
} from 'antd';
import { DeleteTwoTone, DownOutlined, SendOutlined } from '@ant-design/icons';
import EditableTable from '@/components/Table/EditableTable';
import CodeEditor from '@/components/Postman/CodeEditor';
import { httpRequest } from '@/services/request';
import auth from '@/utils/auth';

const { Option } = Select;

const STATUS = {
  200: { color: '#67C23A', text: 'OK' },
  401: { color: '#F56C6C', text: 'unauthorized' },
};

// 状态码和响应时间组件
const tabExtra = (response) => {
  return response && response.response ? (
    <div>
      <span>
        Status:
        <span style={{ color: STATUS[response.status_code].color, marginLeft: 8, marginRight: 8 }}>
          {response.status_code} {STATUS[response.status_code].text}
        </span>
        <span style={{ marginLeft: 8, marginRight: 8 }}>
          Time:<span style={{ color: '#67C23A' }}>{response.elapsed}</span>
        </span>
      </span>
    </div>
  ) : null;
};

export default () => {
  const [bodyType, setBodyType] = useState('none');
  const [rawType, setRawType] = useState('JSON');
  const [paramsData, setParamsData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [method, setMethod] = useState('GET');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [body, setBody] = useState(null);
  const [editableKeys, setEditableRowKeys] = useState(() => paramsData.map((item) => item.id));
  const [headersKeys, setHeadersRowKeys] = useState(() => headers.map((item) => item.id));

  // 请求url+params
  const [url, setUrl] = useState('');

  // url栏下拉选项
  const selectBefore = (
    <Select
      defaultValue="GET"
      value={method}
      onChange={(data) => setMethod(data)}
      style={{ width: 80, fontSize: 16, textAlign: 'left' }}
    >
      <Option value="GET">GET</Option>
      <Option value="POST">POST</Option>
      <Option value="PUT">PUT</Option>
      <Option value="DELETE">DELETE</Option>
    </Select>
  );

  // 根据key删除行
  const onDelete = (columnType, key) => {
    if (columnType === 'params') {
      const data = paramsData.filter((item) => item.id !== key);
      console.log(data);
      setParamsData(data);
      joinUrl(data);
    } else {
      const data = headers.filter((item) => item.id !== key);
      console.log(data);
      setHeaders(data);
    }
  };

  // 根据paramsData拼接url
  const joinUrl = (data) => {
    let tempUrl = url.split('?')[0];
    console.log(data);
    data.forEach((item, idx) => {
      console.log(item.key);
      if (item.key) {
        if (idx === 0) {
          tempUrl = `${tempUrl}?${item.key}=${item.value || ''}`;
        } else {
          tempUrl = `${tempUrl}&${item.key}=${item.value || ''}`;
        }
      }
    });
    setUrl(tempUrl);
  };

  // 拆分url
  const splitUrl = (nowUrl) => {
    const split = nowUrl.split('?');
    if (split.length < 2) {
      setParamsData([]);
    } else {
      const params = split[1].split('&');
      const newparams = [];
      const keys = [];
      params.forEach((item, idx) => {
        const [key, value] = item.split('=');
        const now = Date.now();
        keys.push(now + idx + 10);
        newparams.push({ key, value, id: now + idx + 10, description: '' });
      });
      setParamsData(newparams);
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

  // 拼接http请求
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
    //展示接口返回结果
    // Modal.info({
    //   title: '返回结果',
    //   content: (
    //     <pre>
    //       {typeof res.data.response === 'string'
    //         ? res.data.response
    //         : JSON.stringify(res.data.response, null, 2)}
    //     </pre>
    //   ),
    // });
  };

  //params参数列表
  const columns = (columnType) => {
    return [
      {
        title: 'KEY',
        dataIndex: 'key',
      },
      {
        title: 'VALUE',
        dataIndex: 'value',
      },
      {
        title: 'DESCRIPTION',
        dataIndex: 'description',
      },
      {
        title: '操作',
        width: 80,
        renderFormItem: (text, record) => (
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

  //返回的cookies和Headers列表组件
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

  // raw下拉菜单点击事件
  const onclickMenu = (key) => {
    setRawType(key);
  };

  // raw下拉菜单
  const menu = (
    <Menu>
      <Menu.Item key="Text">
        <a
          onClick={() => {
            onclickMenu('Text');
          }}
        >
          Text
        </a>
      </Menu.Item>
      <Menu.Item key="JavaScript">
        <a
          onClick={() => {
            onclickMenu('JavaScript');
          }}
        >
          JavaScript
        </a>
      </Menu.Item>
      <Menu.Item key="JSON">
        <a
          onClick={() => {
            onclickMenu('JSON');
          }}
        >
          JSON
        </a>
      </Menu.Item>
      <Menu.Item key="HTML">
        <a
          onClick={() => {
            onclickMenu('HTML');
          }}
        >
          HTML
        </a>
      </Menu.Item>
      <Menu.Item key="XML">
        <a
          onClick={() => {
            onclickMenu('XML');
          }}
        >
          XML
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Card>
      {/*url输入框*/}
      <Row gutter={[8, 8]}>
        <Col span={18}>
          <Input
            size="large"
            value={url}
            addonBefore={selectBefore}
            placeholder="请输入要请求的url"
            onChange={(e) => {
              setUrl(e.target.value);
              splitUrl(e.target.value);
            }}
          />
        </Col>

        <Col span={4}>
          {/*发送按钮*/}
          <Button
            onClick={onRequest}
            loading={loading}
            type="primary"
            size="large"
            style={{ marginRight: 16, float: 'right' }}
          >
            <SendOutlined />
            send
          </Button>
        </Col>
      </Row>
      {/*请求方式tab菜单*/}
      <Row style={{ marginTop: 8 }}>
        <Tabs defaultActiveKey="1" style={{ width: '100%' }}>
          {/*Params*/}
          <Tabs.TabPane tab="Params" key="1">
            <EditableTable
              columns={columns('params')}
              title="Query Params"
              dataSource={paramsData}
              setDataSource={setParamsData}
              editableKeys={editableKeys}
              setEditableRowKeys={setEditableRowKeys}
              extra={joinUrl}
            />
          </Tabs.TabPane>
          {/*Headers*/}
          <Tabs.TabPane tab="Headers" key="2">
            <EditableTable
              columns={columns('headers')}
              title="Headers"
              dataSource={headers}
              setDataSource={setHeaders}
              editableKeys={headersKeys}
              setEditableRowKeys={setHeadersRowKeys}
            />
          </Tabs.TabPane>
          {/*Body*/}
          <Tabs.TabPane tab="Body" key="3">
            <Row>
              {/*传参方式单选框*/}
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
              {/*raw传参类型下拉框*/}
              {bodyType === 'raw' ? (
                <Dropdown overlay={menu} style={{ marginLeft: 8 }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    {rawType}
                    <DownOutlined />
                  </a>
                </Dropdown>
              ) : null}
            </Row>
            {/*raw代码编辑组件*/}
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
                This request does not have body
              </div>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Row>
      {/*返回数据tab菜单*/}
      <Row gutter={[8, 8]}>
        {Object.keys(response).length === 0 ? null : (
          <Tabs
            defaultActiveKey="1"
            style={{ width: '100%' }}
            tabBarExtraContent={tabExtra(response)}
          >
            <Tabs.TabPane tab="Body" key="1">
              <CodeEditor
                value={response.response ? JSON.stringify(response.response, null, 2) : ''}
                height="30vh"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Cookie" key="2">
              <Table
                columns={resColumns}
                dataSource={toTable('cookies')}
                size="small"
                pagination={false}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Headers" key="3">
              <Table
                columns={resColumns}
                dataSource={toTable('response_headers')}
                size="small"
                pagination={false}
              />
            </Tabs.TabPane>
          </Tabs>
        )}
      </Row>
    </Card>
  );
};
