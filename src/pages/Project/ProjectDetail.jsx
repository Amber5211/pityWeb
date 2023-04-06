import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Card, Tabs } from 'antd';
import { useParams } from 'umi';
import { queryProject } from '@/services/project';
import auth from '@/utils/auth';
import ProjectInfo from '@/components/Project/ProjectInfo';
import ProjectRole from '@/components/Project/ProjectRole';
import { listUsers } from '@/services/user';
import Directory from '@/components/TestCase/Directory';

const { TabPane } = Tabs;

export default () => {
  //获取url栏的参数
  const params = useParams();
  //获取projectId
  const projectId = params.id;
  //定义项目信息对象
  const [projectData, setProjectData] = useState({});
  //定义项目角色列表
  const [roles, setRoles] = useState([]);
  //定义用户列表
  const [users, setUsers] = useState([]);
  //定义用例树对象
  const [tree, setTree] = useState([]);
  //
  const [userMap, setUserMap] = useState({});

  //获取用户信息
  const fetchUsers = async () => {
    const res = await listUsers();
    setUsers(res);
    const temp = {};
    res.forEach((item) => {
      temp[item.id] = item;
    });
    return temp;
  };

  //获取项目详情信息和用户信息方法
  const fetchData = async () => {
    const user = await fetchUsers();
    setUserMap(user);

    const res = await queryProject({ projectId });
    if (auth.response(res)) {
      setProjectData(res.data.project);
      setRoles(res.data.roles);
      setTree(res.data.test_case);
    }
  };
  //渲染页面时调用fetchData方法
  useEffect(async () => {
    fetchData();
    fetchUsers();
  }, []);

  return (
    <PageContainer
      title={
        <span>
          <Avatar style={{ backgroundColor: '#87d068' }}>
            {projectData.name === undefined ? 'loading...' : projectData.name.slice(0, 2)}
          </Avatar>
          {projectData.name}
        </span>
      }
    >
      <Card bodyStyle={{ padding: '8px 18px' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="用例列表" key="1">
            <Directory
              loading={false}
              treeData={tree}
              fetchData={fetchData}
              projectData={projectData}
              userMap={userMap}
            />
          </TabPane>
          <TabPane tab="成员列表" key="2">
            <ProjectRole
              users={users}
              project={projectData}
              fetchData={fetchData}
              roles={roles}
            ></ProjectRole>
          </TabPane>
          <TabPane tab="项目设置" key="3">
            <ProjectInfo data={projectData} reloadData={fetchData} />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};
