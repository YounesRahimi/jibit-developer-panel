import {Typography} from 'antd'

const { Title, Paragraph } = Typography

const TransactionsPage = () => {
  return (
    <div>
      <Title level={2}>Ledger Transactions</Title>
      <Paragraph>
        View and manage YAL ledger transactions.
      </Paragraph>
    </div>
  )
}

export default TransactionsPage
