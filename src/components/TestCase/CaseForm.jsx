import React from 'react';
import { Badge, Row, Select } from 'antd';
import CommonForm from '@/components/Drawer/CommonForm';
import { CONFIG } from '@/consts/config';
import fields from '@/consts/fields';

const { Option } = Select;

export default ({ data, modal, setModal, onFinish }) => {
  return (
    <Row gutter={[8, 8]}>
      <CommonForm
        title="新增接口测试用例"
        left={6}
        right={8}
        width={800}
        record={data}
        onFinish={onFinish}
        fields={fields.CaseDetail}
        onCancel={() => setModal(false)}
        visible={modal}
      />
    </Row>
  );
};
