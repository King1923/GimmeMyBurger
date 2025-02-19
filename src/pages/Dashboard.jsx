import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardHeader, 
  Avatar,
  Button
} from '@mui/material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  LineElement, 
  PointElement, 
  BarElement,
  ArcElement,
  LinearScale, 
  CategoryScale, 
  Legend, 
  Title, 
  Tooltip 
} from 'chart.js';
import AdminSidebar from '../admin/AdminSideBar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Import icons for the cards
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

ChartJS.register(
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  Legend,
  Title,
  Tooltip
);

const Dashboard = () => {
  const [registrationData, setRegistrationData] = useState([]);
  const [loginData, setLoginData] = useState([]);
  const [stats, setStats] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [sessionStats, setSessionStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedDate = "2025-02-19"; 

  useEffect(() => {
    // Simulate an API call with dummy data after a short delay
    const fetchAnalytics = () => {
      setLoading(true);
      setTimeout(() => {
        const dummyRegistrations = [
          { time: "00:00", count: 2 },
          { time: "01:00", count: 1 },
          { time: "02:00", count: 0 },
          { time: "03:00", count: 0 },
          { time: "04:00", count: 0 },
          { time: "05:00", count: 1 },
          { time: "06:00", count: 3 },
          { time: "07:00", count: 5 },
          { time: "08:00", count: 10 },
          { time: "09:00", count: 15 },
          { time: "10:00", count: 12 },
          { time: "11:00", count: 8 },
          { time: "12:00", count: 14 },
          { time: "13:00", count: 9 },
          { time: "14:00", count: 7 },
          { time: "15:00", count: 11 },
          { time: "16:00", count: 13 },
          { time: "17:00", count: 16 },
          { time: "18:00", count: 18 },
          { time: "19:00", count: 20 },
          { time: "20:00", count: 22 },
          { time: "21:00", count: 19 },
          { time: "22:00", count: 15 },
          { time: "23:00", count: 8 }
        ];

        const dummyLogins = [
          { time: "00:00", count: 5 },
          { time: "01:00", count: 3 },
          { time: "02:00", count: 2 },
          { time: "03:00", count: 2 },
          { time: "04:00", count: 1 },
          { time: "05:00", count: 2 },
          { time: "06:00", count: 4 },
          { time: "07:00", count: 7 },
          { time: "08:00", count: 12 },
          { time: "09:00", count: 18 },
          { time: "10:00", count: 20 },
          { time: "11:00", count: 17 },
          { time: "12:00", count: 22 },
          { time: "13:00", count: 19 },
          { time: "14:00", count: 16 },
          { time: "15:00", count: 21 },
          { time: "16:00", count: 23 },
          { time: "17:00", count: 25 },
          { time: "18:00", count: 28 },
          { time: "19:00", count: 30 },
          { time: "20:00", count: 32 },
          { time: "21:00", count: 29 },
          { time: "22:00", count: 24 },
          { time: "23:00", count: 18 }
        ];

        const dummyStats = {
          totalOrders: 201,
          totalMenu: 45,
          totalRevenue: 15004
        };

        const dummyDailyRevenue = [
          { day: "Mon", revenue: 200 },
          { day: "Tue", revenue: 300 },
          { day: "Wed", revenue: 254.9 },
          { day: "Thu", revenue: 400 },
          { day: "Fri", revenue: 550 },
          { day: "Sat", revenue: 600 },
          { day: "Sun", revenue: 700 },
        ];

        const dummySessionStats = {
          totalSales: 254.90,
          totalSessions: 100,
          firstTimeRate: 0.60,
          returningRate: 0.40,
        };

        setRegistrationData(dummyRegistrations);
        setLoginData(dummyLogins);
        setStats(dummyStats);
        setDailyRevenue(dummyDailyRevenue);
        setSessionStats(dummySessionStats);
        setLoading(false);
      }, 1000);
    };

    fetchAnalytics();
  }, [selectedDate]);

  const totalRegistrations = registrationData.reduce((sum, item) => sum + item.count, 0);
  const totalLogins = loginData.reduce((sum, item) => sum + item.count, 0);
  const loginToOrderRatio = stats && stats.totalOrders > 0 
    ? (totalLogins / stats.totalOrders).toFixed(2) 
    : "0";

  const lineLabels = registrationData.map(item => item.time);
  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Registrations',
        data: registrationData.map(item => item.count),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.2,
        fill: true,
      },
      {
        label: 'Logins',
        data: loginData.map(item => item.count),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        tension: 0.2,
        fill: true,
      },
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Registrations & Logins: ${selectedDate}`
      },
    },
  };

  const barLabels = dailyRevenue.map(item => item.day);
  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Daily Revenue',
        data: dailyRevenue.map(item => item.revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderRadius: 5,
      },
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Daily Revenue'
      },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const donutData = {
    labels: ['First Time', 'Returning'],
    datasets: [
      {
        data: sessionStats 
          ? [sessionStats.firstTimeRate * 100, sessionStats.returningRate * 100]
          : [0, 0],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverOffset: 4,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text: 'Customer Rate'
      },
    },
  };

  // Function to generate a PDF report using jsPDF and jspdf-autotable.
  const generatePDFReport = () => {
    import('jspdf').then(jsPDFModule => {
      import('jspdf-autotable').then(() => {
        const { jsPDF } = jsPDFModule;
        const doc = new jsPDF();
        doc.text('Dashboard Report', 14, 20);
        
        // Create a table for the registrations and logins.
        doc.autoTable({
          head: [['Time', 'Registrations', 'Logins']],
          body: registrationData.map((item, index) => [
            item.time,
            item.count,
            loginData[index] ? loginData[index].count : 0
          ]),
          startY: 30,
        });
        doc.text(`Daily Registrations: ${totalRegistrations}`, 14, doc.lastAutoTable.finalY + 10);
        doc.text(`Daily Logins: ${totalLogins}`, 14, doc.lastAutoTable.finalY + 20);
        doc.text(`Login-to-Order Ratio: ${loginToOrderRatio} logins/order`, 14, doc.lastAutoTable.finalY + 30);
        doc.save('dashboard-report.pdf');
      });
    });
  };

  return (
    <Box sx={{ p: 1, minHeight: '90vh' }}>
      <AdminSidebar />
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard Analytics
      </Typography>

      {loading ? (
        <Typography>Loading analytics...</Typography>
      ) : (
        <>
          {/* Top row: Professional Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ boxShadow: 3 }}>
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><PersonIcon /></Avatar>}
                  title="Daily Registrations"
                  subheader={totalRegistrations}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ boxShadow: 3 }}>
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><LoginIcon /></Avatar>}
                  title="Daily Logins"
                  subheader={totalLogins}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ boxShadow: 3 }}>
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><ShoppingCartIcon /></Avatar>}
                  title="Total Orders"
                  subheader={stats.totalOrders}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ boxShadow: 3 }}>
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><RestaurantMenuIcon /></Avatar>}
                  title="Total Menu Items"
                  subheader={stats.totalMenu}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ boxShadow: 3 }}>
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><MonetizationOnIcon /></Avatar>}
                  title="Total Revenue"
                  subheader={`$${stats.totalRevenue.toLocaleString()}`}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ boxShadow: 3 }}>
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><TrendingUpIcon /></Avatar>}
                  title="Login-to-Order Ratio"
                  subheader={`${loginToOrderRatio} logins/order`}
                />
              </Card>
            </Grid>
          </Grid>

          {/* Bottom row: Two charts side by side */}
          <Grid container spacing={3}>
            {/* Left column: Registrations & Logins line chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, p: 2, height: 427 }}>
                <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                  <Line key="line-chart" data={lineChartData} options={lineChartOptions} />
                </Box>
              </Card>
            </Grid>

            {/* Right column: Stacked - (1) Daily Revenue bar chart, (2) Session stats with small doughnut */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {/* Top card: Bar chart (Daily Revenue) */}
                <Grid item xs={12}>
                  <Card sx={{ boxShadow: 3, p: 2, height: 220 }}>
                    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                      <Bar key="bar-chart" data={barData} options={barOptions} />
                    </Box>
                  </Card>
                </Grid>

                {/* Bottom card: Session stats with small doughnut chart */}
                <Grid item xs={12}>
                  <Card sx={{ boxShadow: 3, p: 2, height: 150 }}>
                    <Grid container spacing={2} sx={{ height: '100%' }}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                          <Doughnut key="doughnut-chart" data={donutData} options={donutOptions} />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'center', 
                            height: '100%' 
                          }}
                        >
                          <Typography variant="subtitle1">
                            Daily Sales: ${sessionStats?.totalSales}
                          </Typography>
                          <Typography variant="subtitle1">
                            Daily Session: {sessionStats?.totalSessions}
                          </Typography>
                          <Typography variant="subtitle1">
                            First Time: {sessionStats
                              ? (sessionStats.firstTimeRate * 100).toFixed(0)
                              : 0}%
                          </Typography>
                          <Typography variant="subtitle1">
                            Returning: {sessionStats
                              ? (sessionStats.returningRate * 100).toFixed(0)
                              : 0}%
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Button to generate a PDF report */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button variant="contained" onClick={generatePDFReport} sx={{ backgroundColor: 'orange', color: 'white', '&:hover': { backgroundColor: 'darkorange' } }}>
              Generate PDF Report
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
