import React, { useState,Suspense, lazy, useRef } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  SettingOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import styles from './index.module.scss';
import log from '../../assets/imgs/log.png';
const Logo = () => <img src={log} alt="logo" className={styles.logo} />;
const items = [
  {
    label: '爱美设计',
    key: 'mail',
  },
  {
    label: 'Navigation Two',
    key: 'app',
    icon: <AppstoreOutlined />,
    disabled: true,
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    icon: <SettingOutlined />,
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            key: 'setting:4',
          },
        ],
      },
    ],
  },
  {
    key: 'alipay',
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Navigation Four - Link
      </a>
    ),
  },
];
const itemsRight = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: 'Option 1',
  },
  {
    key: '2',
    icon: <DesktopOutlined />,
    label: 'Option 2',
  },
  {
    key: '3',
    icon: <ContainerOutlined />,
    label: 'Option 3',
  },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: <MailOutlined />,
    children: [
      {
        key: '5',
        label: 'Option 5',
      },
      {
        key: '6',
        label: 'Option 6',
      },
      {
        key: '7',
        label: 'Option 7',
      },
      {
        key: '8',
        label: 'Option 8',
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '9',
        label: 'Option 9',
      },
      {
        key: '10',
        label: 'Option 10',
      },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          {
            key: '11',
            label: 'Option 11',
          },
          {
            key: '12',
            label: 'Option 12',
          },
        ],
      },
    ],
  },
];
const Template = lazy(() => import('../../components/Template/index.jsx'));
const VirtualWaterList = lazy(() => import('../../components/WaterList/index.jsx'));
const Editor = () => {
  const [current, setCurrent] = useState('mail');
  const [watersData, setWatersData] = useState([{
    url:"../../assets/waters/small_1.png",
    id:'87232',
    name:'灰鱼啊',
  },{
    url:"../../assets/waters/small_2.png",
    id:'46232',
    name:'开始的',
  },{
    url:"../../assets/waters/small_3.png",
    id:'867832',
    name:'是想吃',
  }
  ])
  const containerRef = useRef();
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  const handleItemHeight = (height,defaultH) => {
    return height?height:defaultH;
  }
  const handleChildElement = (data) => {
    console.log(data);
  }
  const isBackToBottom = (isBack) => {
    console.log(isBack);
  }
  const handleThrowData = (data) => {
    console.log(data);
  }
  return <div className={styles.container}>
  <Logo/>
  <Menu className={styles.flex1} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
  <div className={styles.main}>
    <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="light"
          inlineCollapsed={true}
          items={itemsRight}
          className={styles.rightMenu}
        />
    <Suspense fallback={<div>Loading...</div>}>
      <Template>
        <VirtualWaterList
        //容器高度
         overallData={watersData}
         //容器宽度
         containerHeight={(90*(window.innerHeight-46))/100}
         //容器宽度
         containerWidth={380}
         itemWidth={180}
         itemMaxWidth={180}
         maxSpace={10}
         containerRef={containerRef}
         handleItemHeight={handleItemHeight}
         handleChildElement={handleChildElement}
         isDefaultBottom={isBackToBottom}
         handleThrowData={handleThrowData}
        />
      </Template>
    </Suspense>
  </div>
  </div>;
};
export default Editor;
