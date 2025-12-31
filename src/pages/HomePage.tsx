import {Button, Card, Space, Typography} from 'antd'
import {ApiOutlined, RocketOutlined} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const HomePage = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>Welcome to Jibit Developer Panel</Title>
        <Paragraph>
          This is a modern React TypeScript application connected to Hitman API at{' '}
          <code>https://hitman.jibit.cloud</code>
        </Paragraph>
      </div>

      <Space size="large" wrap>
        <Card
          hoverable
          style={{ width: 300 }}
          cover={
            <div
              style={{
                padding: 40,
                textAlign: 'center',
                background: '#f0f2f5',
              }}
            >
              <ApiOutlined style={{ fontSize: 60, color: '#1890ff' }} />
            </div>
          }
        >
          <Card.Meta
            title="API Integration"
            description="Connect to Hitman API and manage your integrations"
          />
          <Button type="primary" style={{ marginTop: 16 }}>
            Get Started
          </Button>
        </Card>

        <Card
          hoverable
          style={{ width: 300 }}
          cover={
            <div
              style={{
                padding: 40,
                textAlign: 'center',
                background: '#f0f2f5',
              }}
            >
              <RocketOutlined style={{ fontSize: 60, color: '#52c41a' }} />
            </div>
          }
        >
          <Card.Meta
            title="Quick Start"
            description="Follow the documentation to set up your first integration"
          />
          <Button type="default" style={{ marginTop: 16 }}>
            Learn More
          </Button>
        </Card>
      </Space>
    </Space>
  )
}

export default HomePage
