'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSalesStats, getSalesByDay, getSales } from '@/lib/actions/sale-actions';
import { getExpensesStats, getExpensesByDay } from '@/lib/actions/expense-actions';
import { getDateRange, DatePeriod } from '@/lib/dateRange';
import { formatCurrency } from '@/lib/currency';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

interface DailySalesData {
  date: string;
  sales: number;
  expenses: number;
}

interface PaymentMethodData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<DatePeriod>('month');
  const [stats, setStats] = useState({
    totalSales: 0,
    totalExpenses: 0,
    profit: 0,
    salesCount: 0,
    avgTicket: 0,
  });
  const [salesByDay, setSalesByDay] = useState<DailySalesData[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const dateRange = getDateRange(period, true);

      // Obtener estadísticas
      const [salesStats, expensesStats] = await Promise.all([
        getSalesStats(dateRange),
        getExpensesStats(dateRange),
      ]);

      setStats({
        totalSales: salesStats.totalSales,
        totalExpenses: expensesStats.totalExpenses,
        profit: salesStats.totalSales - expensesStats.totalExpenses,
        salesCount: salesStats.salesCount,
        avgTicket: salesStats.avgTicket,
      });

      // Datos por método de pago
      const paymentData = Object.entries(salesStats.byPaymentMethod).map(
        ([method, total]) => ({
          name: getPaymentMethodLabel(method),
          value: total,
        })
      );
      setPaymentMethodData(paymentData);

      // Ventas por día
      const salesDayData = await getSalesByDay(dateRange);
      const expensesDayData = await getExpensesByDay(dateRange);

      // Combinar datos
      const allDates = new Set([
        ...salesDayData.map((d) => d.date),
        ...expensesDayData.map((d) => d.date),
      ]);

      const combined = Array.from(allDates)
        .sort()
        .map((date) => {
          const sale = salesDayData.find((s) => s.date === date);
          const expense = expensesDayData.find((e) => e.date === date);
          return {
            date: new Date(date).toLocaleDateString('es', {
              day: '2-digit',
              month: '2-digit',
            }),
            sales: sale ? Number(sale.total) : 0,
            expenses: expense ? Number(expense.amount) : 0,
          };
        });

      setSalesByDay(combined);
    } catch (error) {
      toast.error('Error al cargar el dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      CASH: 'Efectivo',
      TRANSFER: 'Transferencia',
      CARD: 'Tarjeta',
      OTHER: 'Otro',
    };
    return labels[method] || method;
  };

  const getPeriodLabel = (p: DatePeriod) => {
    const labels: Record<DatePeriod, string> = {
      today: 'Hoy',
      week: 'Semana',
      biweekly: 'Quincena',
      month: 'Mes',
      semester: 'Semestre',
      year: 'Año',
    };
    return labels[p];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Vista general de ventas, gastos y utilidades
          </p>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as DatePeriod)}>
          <TabsList>
            <TabsTrigger value="today">Hoy</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="biweekly">Quincena</TabsTrigger>
            <TabsTrigger value="month">Mes</TabsTrigger>
            <TabsTrigger value="semester">Semestre</TabsTrigger>
            <TabsTrigger value="year">Año</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Cargando estadísticas...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas Totales
                </CardTitle>
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 animate-in fade-in slide-in-from-bottom-3 duration-700">
                  {formatCurrency(stats.totalSales)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getPeriodLabel(period)}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Gastos Totales
                </CardTitle>
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 animate-in fade-in slide-in-from-bottom-3 duration-700">
                  {formatCurrency(stats.totalExpenses)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getPeriodLabel(period)}
                </p>
              </CardContent>
            </Card>

            <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 ${stats.profit >= 0 ? 'border-l-emerald-500' : 'border-l-orange-500'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Utilidad
                </CardTitle>
                <div className={`p-2 rounded-full ${stats.profit >= 0 ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-orange-100 dark:bg-orange-900'}`}>
                  <TrendingUp className={`h-4 w-4 ${stats.profit >= 0 ? 'text-emerald-600' : 'text-orange-600'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold animate-in fade-in slide-in-from-bottom-3 duration-700 ${stats.profit >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {formatCurrency(stats.profit)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ventas - Gastos
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  # Ventas
                </CardTitle>
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold animate-in fade-in slide-in-from-bottom-3 duration-700">
                  {stats.salesCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Transacciones
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-indigo-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ticket Promedio
                </CardTitle>
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                  <DollarSign className="h-4 w-4 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold animate-in fade-in slide-in-from-bottom-3 duration-700">
                  {formatCurrency(stats.avgTicket)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Por venta
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Ventas vs Gastos por Día
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart 
                    data={salesByDay}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Ventas"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      strokeWidth={3}
                      name="Gastos"
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  Ventas por Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#2563eb" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="grad3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#d97706" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="grad4" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={{
                        stroke: '#6b7280',
                        strokeWidth: 1,
                      }}
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(1)}%`
                      }
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#grad${(index % 4) + 1})`}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

