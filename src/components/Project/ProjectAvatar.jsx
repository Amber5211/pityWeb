import React from 'react';
import { Avatar } from 'antd';

export default ({ data }) => {
  if (data === null) {
    return null;
  }
  return (
    <Avatar style={{ backgroundColor: '#87d068' }} size={64}>
      {data.data.name.slice(0, 2)}
    </Avatar>
  );
};
