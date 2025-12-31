import {Typography} from 'antd'

const { Title, Paragraph } = Typography

const AccountsPage = () => {
  return (
    <div>
      <Title level={2}>Ledger Accounts</Title>
      <Paragraph>
        View and manage YAL ledger accounts.
      </Paragraph>
    </div>
  )
}

export default AccountsPage
