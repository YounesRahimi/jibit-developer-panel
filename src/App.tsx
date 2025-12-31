import {Route, Routes} from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import AppPropertiesPage from './pages/home/AppPropertiesPage'
import ProjectXInquiryPurchasePage from './pages/projectx/InquiryPurchasePage'
import ProjectXPspMetricsPage from './pages/projectx/PspMetricsPage'
import AgentsInquiryPurchasePage from './pages/agents/InquiryPurchasePage'
import LedgerTransactionsPage from './pages/ledger/TransactionsPage'
import LedgerAccountsPage from './pages/ledger/AccountsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="home/app-properties" element={<AppPropertiesPage />} />
        <Route path="projectx/inquiry-purchase" element={<ProjectXInquiryPurchasePage />} />
        <Route path="projectx/psp-metrics" element={<ProjectXPspMetricsPage />} />
        <Route path="agents/inquiry-purchase" element={<AgentsInquiryPurchasePage />} />
        <Route path="ledger/transactions" element={<LedgerTransactionsPage />} />
        <Route path="ledger/accounts" element={<LedgerAccountsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
