import React, { useState } from 'react';
import { Card, Col, Dropdown, Menu, Result, Row, Spin } from 'antd';
import ProfessionalTree from '@/components/Tree/ProfessionalTree';
import { BugTwoTone, FolderOutlined, FolderTwoTone, PlusOutlined } from '@ant-design/icons';
import CaseForm from '@/components/TestCase/CaseForm';
import { values } from 'lodash';
import { createTestCase } from '@/services/testcase';
import auth from '@/utils/auth';
import TestCaseDetail from '@/components/TestCase/TestCaseDetail';

export default ({ loading, treeData, fetchData, projectData }) => {
  //搜索框查询的数据
  const [searchValue, setSearchValue] = useState('');
  //Drawer抽屉是否展示
  const [drawer, setDrawer] = useState(false);
  //testcase信息
  const [caseinfo, setCaseinfo] = useState({ request_type: '1' });
  //用例id数据，默认为null
  const [caseId, setCaseId] = useState(null);

  //新增用例菜单组件
  const menu = (
    <Menu>
      <Menu.Item icon={<FolderOutlined />}>
        <a
          onClick={() => {
            setDrawer(true);
          }}
        >
          添加用例
        </a>
      </Menu.Item>
    </Menu>
  );
  //获取选择的用例id
  const onSelectKeys = (keys) => {
    if (keys.length > 0 && keys[0].indexOf('case_') > -1) {
      //说明是case
      setCaseId(parseInt(keys[0].split('-')[1], 10));
    } else {
      setCaseId(null);
    }
  };

  //新增用例下拉菜单组件
  const AddButton = (
    <Dropdown overlay={menu}>
      <a style={{ marginLeft: 8 }}>
        <PlusOutlined style={{ fontSize: 16, marginTop: 4, cursor: 'pointer' }} />
      </a>
    </Dropdown>
  );
  //树的图标组件
  const iconMap = (key) => {
    if (key.indexOf('cat') > -1) {
      return <FolderTwoTone twoToneColor="#ffc519" />;
    }
    if (key.indexOf('case') > -1) {
      return <BugTwoTone twoToneColor="#13CE66" />;
    }
  };

  //调用接口，新增用例
  const onCreateCase = async (values) => {
    const res = await createTestCase({
      ...values,
      request_type: parseInt(values.request_type, 10),
      status: parseInt(values.status, 10),
      tag: values.tag !== undefined ? values.tag.join(',') : null,
      project_id: projectData.id,
    });
    if (auth.response(res, true)) {
      setDrawer(false);
      await fetchData();
    }
  };

  return (
    <Spin spinning={loading} tip="努力加载中">
      <CaseForm
        data={caseinfo}
        modal={drawer}
        setModal={setDrawer}
        onFinish={onCreateCase}
      ></CaseForm>
      <Row gutter={[8, 8]}>
        <Col span={6}>
          <Card bodyStyle={{ padding: 12, minHeight: 50, maxHeight: 500, overflowY: 'auto' }}>
            <ProfessionalTree
              gData={treeData}
              checkable={false}
              AddButton={AddButton}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              iconMap={iconMap}
              suffixMap={() => {
                return null;
              }}
              onSelect={onSelectKeys}
            />
          </Card>
        </Col>
        <Col span={17}>
          <Card
            bodyStyle={{ padding: 12, minHeight: 500, maxHeight: 500, overflowY: 'auto' }}
          ></Card>
          {caseId === null ? (
            <Result title="请选择左侧用例" status="info" />
          ) : (
            <TestCaseDetail caseId={caseId} />
          )}
        </Col>
      </Row>
    </Spin>
  );
};
