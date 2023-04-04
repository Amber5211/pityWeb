import React, { useEffect, useState } from 'react';
import { Col, Empty, Input, Row, Spin, Tooltip, Tree } from 'antd';

const { TreeNode } = Tree;

export default (props) => {
  //指定的树节点数据
  const [expandedKeys, setExpandedKeys] = useState(props.expandedKeys);
  //是否自动展开父节点数据
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  //当前选中的key数据
  const [currentKey, setCurrentKey] = useState(null);

  let dataList = [];

  // 展开/收起节点时触发
  const onExpand = (expandedKeys) => {
    setAutoExpandParent(false);
    if (props.onExpand) {
      props.onExpand(expandedKeys);
      return;
    }
    setExpandedKeys(expandedKeys);
  };
  //查询数组中与key相同的children中的数据的key
  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  //输入框查询
  const onchange = (e) => {
    if (props.onchange) {
      props.onchange(e);
      return;
    }
    const { value } = e.target;
    dataList = [];
    generateList(props.gData);
    const expKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, props.gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    props.setSearchValue(value);
    setAutoExpandParent(true);
    if (props.onExpand) {
      props.onExpand(expandedKeys.length > 0 ? expandedKeys : []);
    } else if (expKeys.length > 0) {
      setExpandedKeys(expKeys);
    } else {
      setExpandedKeys([]);
    }
  };

  //树数据处理
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({
        key,
        title: node.title,
      });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  //格式化目录
  const parseDirectory = (key, title, requestType) => {
    const index = title.toLowerCase().indexOf(props.searchValue.toLowerCase());
    const beforeStr = title.substr(0, index);
    const afterStr = title.substr(index + props.searchValue.length);
    return props.searchValue !== '' && index > -1 ? (
      <span>
        {<span>{beforeStr}</span>}
        <span style={{ color: '#f50' }}>{title.substr(index, props.searchValue.length)}</span>
        {afterStr}
      </span>
    ) : (
      <span>
        <Tooltip title={title}>
          {requestType !== undefined ? (
            requestType === 0 ? (
              <a style={{ color: '#DEB946' }}>RPC</a>
            ) : (
              <a style={{ color: '#f540c9' }}>MSG</a>
            )
          ) : null}{' '}
          {title.length > 16 ? `${title.slice(0, 16)}...` : title}
        </Tooltip>
      </span>
    );
  };

  //格式化Title
  const parseTitle = (key, title, suffix) => {
    const index = title.toLowerCase().indexOf(props.searchValue.toLowerCase());
    const beforeStr = title.substr(0, index);
    const afterStr = title.substr(index + props.searchValue.length);
    return props.searchValue !== '' && index > -1 ? (
      <span>
        {<span>{beforeStr}</span>}
        <span style={{ color: '#f50' }}>{title.substr(index, props.searchValue.length)}</span>
        {afterStr} {key === currentKey ? suffix : null}
      </span>
    ) : (
      <span
        onMouseLeave={() => {
          setTimeout(() => {
            setCurrentKey(null);
          }, 100);
        }}
        onMouseEnter={() => setCurrentKey(key)}
      >
        <Tooltip title={title}>
          {title.length > 16 ? `${title.slice(0, 16)}...` : title}
          {key === currentKey ? suffix : null}
        </Tooltip>
      </span>
    );
  };

  //页面渲染时调用
  useEffect(() => {
    generateList(props.gData);
  }, []);

  //树型数据展示组件
  const loop = (data) =>
    data.map((item) => {
      if (item.children !== undefined) {
        return (
          <TreeNode
            key={item.key}
            icon={props.iconMap(item.key)}
            title={
              <span
                onMouseLeave={() => setCurrentKey(null)}
                onMouseEnter={() => setCurrentKey(item.key)}
              >
                {parseDirectory(item.key, item.title, item.requestType)}({item.total})
                {item.key === currentKey ? props.suffixMap(item) : null}
              </span>
            }
          >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.key}
          icon={props.iconMap(item.key)}
          onMouseEnter={() => setCurrentKey(item.key)}
          title={parseTitle(item.key, item.title, props.suffixMap(item))}
        />
      );
    });

  return (
    <Spin spinning={props.loading ? props.loading : false}>
      <Row style={{ padding: 8, marginBottom: 4 }}>
        <Col span={22}>
          <Input
            placeholder="请输入用例名称"
            style={{ width: '90%' }}
            onChange={onchange}
            size="small"
            allowClear
            value={props.searchValue}
          />
        </Col>
        <Col span={2}>{props.AddButton}</Col>
      </Row>
      {props.gData.length > 0 ? (
        <Tree
          blockNode //是否节点占据一行,默认为false
          showIcon //是否展示 TreeNode title 前的图标,默认为false
          defaultExpandParent //默认展开父节点,默认为true
          onExpand={onExpand} //展开/收起节点时触发
          expandedKeys={expandedKeys} //（受控）展开指定的树节点
          autoExpandParent={autoExpandParent} //是否自动展开父节点
          // onSelect={props.onSelect}//点击树节点触发
        >
          {loop(props.gData)}
        </Tree>
      ) : (
        <Empty />
      )}
    </Spin>
  );
};
