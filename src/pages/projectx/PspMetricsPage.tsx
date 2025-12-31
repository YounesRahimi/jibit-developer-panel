import {useMemo, useState} from 'react'
import {Alert, Button, Card, Col, Row, Select, Space, Spin, Typography} from 'antd'
import {DatePicker} from 'antd-jalali'
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment-jalaali'
import {pspMetricsService} from '../../services/pspMetricsService'
import {AggregationPeriod, PspVendor} from '../../types/pspMetrics'

const { Title } = Typography
const { RangePicker } = DatePicker

const PSP_VENDORS: PspVendor[] = ['SAMAN', 'SEPEHR', 'BEHPARDAKHT', 'AP']
const AGGREGATION_PERIODS: AggregationPeriod[] = ['DAY', 'WEEK', 'MONTH']

const PSP_COLORS: Record<PspVendor, string> = {
  SAMAN: '#1890ff',
  SEPEHR: '#52c41a',
  BEHPARDAKHT: '#fa8c16',
  AP: '#eb2f96',
}

const PspMetricsPage = () => {
  const [selectedPsps, setSelectedPsps] = useState<PspVendor[]>(PSP_VENDORS)
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().subtract(15, 'days'),
    moment(),
  ])
  const [aggregationPeriod, setAggregationPeriod] = useState<AggregationPeriod>('DAY')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pspMetrics', selectedPsps, dateRange, aggregationPeriod],
    queryFn: async () => {
      return await pspMetricsService.getPspMetrics({
        pspVendors: selectedPsps,
        startDate: dateRange[0].format('jYYYY-jMM-jDD'),
        endDate: dateRange[1].format('jYYYY-jMM-jDD'),
        aggregationPeriod,
      })
    },
    enabled: false,
  })

  const handleFetch = () => {
    refetch()
  }

  const chartData = useMemo(() => {
    if (!data?.elements) return []

    const grouped = data.elements.reduce((acc, metric) => {
      if (!acc[metric.timePeriod]) {
        acc[metric.timePeriod] = { timePeriod: metric.timePeriod }
      }
      const pspKey = metric.psp
      acc[metric.timePeriod][`${pspKey}_allApisDownTimes`] = metric.allApisDownTimes
      acc[metric.timePeriod][`${pspKey}_allApisCallCount`] = metric.allApisCallCount
      acc[metric.timePeriod][`${pspKey}_healthApiDownTimes`] = metric.healthApiDownTimes
      acc[metric.timePeriod][`${pspKey}_paymentDownTimes`] = metric.paymentDownTimes
      acc[metric.timePeriod][`${pspKey}_initialDelayAverageInMillis`] = metric.initialDelayAverageInMillis
      acc[metric.timePeriod][`${pspKey}_paymentDelayAverageInMillis`] = metric.paymentDelayAverageInMillis
      acc[metric.timePeriod][`${pspKey}_verificationDelayAverageInMillis`] = metric.verificationDelayAverageInMillis
      return acc
    }, {} as Record<string, any>)

    return Object.values(grouped).sort((a, b) => a.timePeriod.localeCompare(b.timePeriod))
  }, [data])

  const renderChart = (
    title: string,
    dataKey: string,
    yAxisLabel: string
  ) => (
    <Card title={title} style={{ marginBottom: 24 }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timePeriod" />
          <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {selectedPsps.map((psp) => (
            <Line
              key={psp}
              type="monotone"
              dataKey={`${psp}_${dataKey}`}
              stroke={PSP_COLORS[psp]}
              name={psp}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )

  return (
    <div>
      <Title level={2}>ProjectX - PSP Metrics</Title>

      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Select
                mode="multiple"
                placeholder="Select PSP Vendors"
                value={selectedPsps}
                onChange={setSelectedPsps}
                style={{ width: '100%' }}
                options={PSP_VENDORS.map((psp) => ({ label: psp, value: psp }))}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <RangePicker
                value={dateRange}
                onChange={(dates: [moment.Moment | null, moment.Moment | null] | null) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([dates[0], dates[1]])
                  }
                }}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Select
                placeholder="Aggregation Period"
                value={aggregationPeriod}
                onChange={setAggregationPeriod}
                style={{ width: '100%' }}
                options={AGGREGATION_PERIODS.map((period) => ({
                  label: period,
                  value: period,
                }))}
              />
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Button type="primary" onClick={handleFetch} block disabled={selectedPsps.length === 0}>
                Fetch Metrics
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin size="large" />
        </div>
      )}

      {error && (
        <Alert
          message="Error"
          description={error.message || 'Failed to fetch PSP metrics'}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {data && chartData.length > 0 && (
        <>
          {renderChart('All APIs Down Times', 'allApisDownTimes', 'Down Times')}
          {renderChart('All APIs Call Count', 'allApisCallCount', 'Call Count')}
          {renderChart('Health API Down Times', 'healthApiDownTimes', 'Down Times')}
          {renderChart('Payment Down Times', 'paymentDownTimes', 'Down Times')}
          {renderChart('Initial Delay Average', 'initialDelayAverageInMillis', 'Milliseconds')}
          {renderChart('Payment Delay Average', 'paymentDelayAverageInMillis', 'Milliseconds')}
          {renderChart('Verification Delay Average', 'verificationDelayAverageInMillis', 'Milliseconds')}
        </>
      )}

      {data && chartData.length === 0 && !isLoading && (
        <Alert
          message="No Data"
          description="No metrics found for the selected filters"
          type="info"
          showIcon
        />
      )}
    </div>
  )
}

export default PspMetricsPage
