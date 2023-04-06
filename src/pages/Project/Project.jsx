import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, Row, Tooltip, Input, Spin, Card, Empty, Popover, Avatar, Select } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { process } from '@/utils/utils';
import { insertProject, listProject } from '@/services/project';
import auth from '@/utils/auth';
import FormForModal from '@/components/PityForm/FormForModal';
import { listUsers } from '@/services/user';
import { history } from 'umi';

const { Search } = Input;
const { Option } = Select;

export default () => {
  //项目列表数据
  const [data, setData] = useState([]);
  //项目分页数据
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8, total: 0 });
  //创建项目表单是否可见数据
  const [visible, setVisible] = useState(false);
  //用户管理员数据
  const [users, setUsers] = useState({});

  //获取项目列表
  const fetchData = async (current = pagination.current, size = pagination.pageSize) => {
    await process(async () => {
      const res = await listProject({ page: current, size });
      if (auth.response(res)) {
        setData(res.data);
        setPagination({ ...pagination, total: res.total });
      }
    });
  };
  //获取用户列表
  const getUsers = async () => {
    const user = await listUsers();
    const temp = {};
    user.forEach((item) => {
      temp[item.id] = item;
    });
    setUsers(temp);
  };
  //组件渲染时调用fetchData()方法
  useEffect(async () => {
    await getUsers();
    await fetchData();
  }, []);

  //根据项目名称查询项目方法
  const onSearchProject = async (projectName) => {
    await process(async () => {
      const res = await listProject({ page: 1, size: pagination.pageSize, name: projectName });
      if (auth.response(res)) {
        setData(res.data);
        setPagination({ ...pagination, current: 1, total: res.total });
      }
    });
  };
  //新增项目方法
  const onHandleCreate = async (values) => {
    const res = await insertProject(values);
    if (auth.response(res, true)) {
      setVisible(false);
      //创建成功后自动获取第一页的数据
      await fetchData(1);
    }
  };

  //解析项目简介信息并返回div展示
  const content = (item) => {
    return (
      <div>
        <p>负责人:{users[item.owner].name}</p>
        <p>简介:{item.description || '无'}</p>
        <p>更新时间:{item.updated_at}</p>
      </div>
    );
  };

  const opt = (
    <Select placeholder="请选择项目负责人">
      {Object.keys(users).map((id) => (
        <Option key={id} value={id}>
          {users[id].name}
        </Option>
      ))}
    </Select>
  );
  //新增项目表单项
  const fields = [
    {
      name: 'projectName',
      label: '项目名称',
      required: true,
      message: '请输入项目名称',
      type: 'input',
      placeholder: '请输入项目名称',
    },
    {
      name: 'app',
      label: '服务名',
      required: true,
      message: '请输入项目对应服务名称',
      type: 'input',
      placeholder: '请输入项目对应服务名称',
    },
    {
      name: 'owner',
      label: '项目负责人',
      required: true,
      component: opt,
      type: 'select',
    },
    {
      name: 'description',
      label: '项目描述',
      required: false,
      message: '请输入项目描述',
      type: 'textarea',
      placeholder: '请输入项目描述',
    },
    {
      name: 'private',
      label: '是否私有',
      required: true,
      message: '请选择项目是否私有',
      type: 'switch',
      valuePropName: 'checked',
    },
  ];

  return (
    // width,title,left,right,visible,onCancel,loading=true,formName,record,fields,onFinish
    <PageContainer title={false}>
      <FormForModal
        title="添加项目"
        width={600}
        left={6}
        right={8}
        visible={visible}
        onCancel={() => setVisible(false)}
        record={{ private: false }}
        fields={fields}
        onFinish={onHandleCreate}
      />
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={18}>
          <Button type="primary" onClick={() => setVisible(true)}>
            创建项目
            <Tooltip title="只有超级管理员可以创建项目">
              <span>
                <QuestionCircleOutlined />
              </span>
            </Tooltip>
          </Button>
        </Col>
        <Col span={6}>
          <Search
            placeholder="请输入项目名称"
            onSearch={onSearchProject}
            style={{ float: 'right' }}
          />
        </Col>
      </Row>
      <Spin spinning={false}>
        <Row gutter={16}>
          {data.length === 0 ? (
            <Col span={24} style={{ textAlign: 'center', marginBottom: 12 }}>
              <Card>
                <Empty description='"暂无项目, 快点击『创建项目』创建一个吧!"' />
              </Card>
            </Col>
          ) : (
            data.map((item) => (
              <Col span={4} style={{ marginBottom: 12 }} key={item.id}>
                <Popover content={content(item)} placement="rightTop">
                  <Card
                    hoverable
                    bordered={false}
                    style={{ borderRadius: 16, textAlign: 'center' }}
                    bodyStyle={{ padding: 16 }}
                    onClick={() => {
                      history.push(`/project/${item.id}`);
                    }}
                  >
                    <Avatar style={{ backgroundColor: '#87d068' }} size={64}>
                      {item.name.slice(0, 2)}
                    </Avatar>
                    <p
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 18,
                        marginTop: 8,
                      }}
                    >
                      {item.name}
                    </p>
                  </Card>
                </Popover>
              </Col>
            ))
          )}
        </Row>
      </Spin>
    </PageContainer>
  );
};
