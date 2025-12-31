import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Button, Card, Form, Input, message, Space, Typography} from 'antd'
import {LockOutlined} from '@ant-design/icons'
import {useAuthStore} from '../stores/useAuthStore'
import {verifyToken} from '../services/authService'

const { Title, Paragraph } = Typography

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: { token: string }) => {
    setLoading(true)
    try {
      const userData = await verifyToken(values.token)

      if (!userData.active) {
        message.error('Token is not active')
        return
      }

      login(userData)
      message.success('Login successful')
      navigate('/')
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Invalid token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          width: 450,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <LockOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={2}>Jibit Developer Panel</Title>
            <Paragraph type="secondary">
              Enter your access token to continue
            </Paragraph>
          </div>

          <Form
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="token"
              rules={[
                { required: true, message: 'Please enter your token' },
                { min: 10, message: 'Token must be at least 10 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your access token"
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>

          <Paragraph type="secondary" style={{ fontSize: 12 }}>
            Connected to <code>https://hitman.jibit.cloud</code>
          </Paragraph>
        </Space>
      </Card>
    </div>
  )
}

export default LoginPage
