import { EditableProTable } from '@ant-design/pro-table';
import React, { useState } from 'react';

export default ({
  columns,
  title,
  dataSource,
  setDataSource,
  editableKeys,
  setEditableRowKeys,
  extra,
}) => {
  return (
    <EditableProTable
      headerTitle={title}
      columns={columns}
      rowKey="id"
      value={dataSource}
      onChange={setDataSource}
      recordCreatorProps={{
        newRecordType: 'dataSource',
        record: () => ({
          id: Date.now(),
        }),
      }}
      editable={{
        type: 'multiple',
        editableKeys,
        actionRender: (row, config, defaultDoms) => {
          return [defaultDoms.delete];
        },
        onValuesChange: (record, recordList) => {
          if (extra) {
            extra(recordList);
          }
          setDataSource(recordList);
        },
        onChange: setEditableRowKeys,
      }}
    />
  );
};
