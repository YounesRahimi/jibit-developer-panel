import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import type {MenuProps} from 'antd'
import {Button, Dropdown, Layout, Menu, theme} from 'antd'
import {
  ApiOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProjectOutlined,
  UserOutlined,
  WalletOutlined
} from '@ant-design/icons'
import {useAuthStore} from '../../stores/useAuthStore'
import {useMemo} from 'react'

const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const AppLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, hasPermission, hasAnyPermission } = useAuthStore()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'username',
      label: user?.username,
      icon: <UserOutlined />,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ]

  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
      {
        key: 'home',
        icon: <HomeOutlined />,
        label: 'Home',
        children: [
          {
            key: '/',
            label: 'Dashboard',
          },
          {
            key: '/home/app-properties',
            label: 'Apps Properties',
          },
        ],
      },
    ]

    // ProjectX menu - check for "projectx" permission
    if (hasPermission('projectx')) {
      items.push({
        key: 'projectx',
        icon: <ProjectOutlined />,
        label: 'ProjectX',
        children: [
          {
            key: '/projectx/inquiry-purchase',
            label: 'Inquiry Purchase',
          },
          {
            key: '/projectx/psp-metrics',
            label: 'PSP Metrics',
          },
        ],
      })
    }

    // Agents menu - check for "saman", "sepehr", "behpardakht", or "ap" permissions
    if (hasAnyPermission(['saman', 'sepehr', 'behpardakht', 'ap'])) {
      items.push({
        key: 'agents',
        icon: <ApiOutlined />,
        label: 'Agents',
        children: [
          {
            key: '/agents/inquiry-purchase',
            label: 'Inquiry Purchase',
          },
        ],
      })
    }

    // Ledger menu - check for "yal" permission
    if (hasPermission('yal')) {
      items.push({
        key: 'ledger',
        icon: <WalletOutlined />,
        label: 'Ledger',
        children: [
          {
            key: '/ledger/transactions',
            label: 'Transactions',
          },
          {
            key: '/ledger/accounts',
            label: 'Accounts',
          },
        ],
      })
    }

    return items
  }, [hasPermission, hasAnyPermission])

  const getSelectedKeys = () => {
    if (location.pathname === '/') return ['/']
    return [location.pathname]
  }

  const getOpenKeys = () => {
    if (location.pathname.startsWith('/home')) return ['home']
    if (location.pathname.startsWith('/projectx')) return ['projectx']
    if (location.pathname.startsWith('/agents')) return ['agents']
    if (location.pathname.startsWith('/ledger')) return ['ledger']
    return ['home']
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Jibit Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 500 }}>
            Jibit Developer Panel
          </div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />}>
              {user?.username}
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Jibit Developer Panel ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  )
}

export default AppLayout
