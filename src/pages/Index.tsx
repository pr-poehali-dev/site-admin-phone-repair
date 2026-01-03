import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type OrderStatus = 'new' | 'diagnostics' | 'repair' | 'completed' | 'issued';

interface Order {
  id: string;
  client: string;
  phone: string;
  device: string;
  issue: string;
  status: OrderStatus;
  cost: number;
  date: string;
}

interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  duration: string;
}

const statusColors: Record<OrderStatus, string> = {
  new: 'bg-blue-500',
  diagnostics: 'bg-purple-500',
  repair: 'bg-orange-500',
  completed: 'bg-green-500',
  issued: 'bg-gray-500',
};

const statusLabels: Record<OrderStatus, string> = {
  new: 'Новый',
  diagnostics: 'Диагностика',
  repair: 'Ремонт',
  completed: 'Завершён',
  issued: 'Выдан',
};

export default function Index() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      client: 'Иван Петров',
      phone: '+7 (999) 123-45-67',
      device: 'iPhone 13 Pro',
      issue: 'Разбит экран',
      status: 'repair',
      cost: 8500,
      date: '2026-01-03',
    },
    {
      id: 'ORD-002',
      client: 'Мария Сидорова',
      phone: '+7 (999) 234-56-78',
      device: 'Samsung Galaxy S22',
      issue: 'Не заряжается',
      status: 'diagnostics',
      cost: 0,
      date: '2026-01-03',
    },
    {
      id: 'ORD-003',
      client: 'Алексей Смирнов',
      phone: '+7 (999) 345-67-89',
      device: 'iPhone 12',
      issue: 'Замена батареи',
      status: 'completed',
      cost: 3500,
      date: '2026-01-02',
    },
  ]);

  const [services] = useState<Service[]>([
    { id: '1', category: 'Экран', name: 'Замена дисплея iPhone 13 Pro', price: 8500, duration: '1-2 часа' },
    { id: '2', category: 'Экран', name: 'Замена дисплея iPhone 12', price: 7000, duration: '1-2 часа' },
    { id: '3', category: 'Экран', name: 'Замена стекла Samsung Galaxy S22', price: 6500, duration: '2-3 часа' },
    { id: '4', category: 'Батарея', name: 'Замена аккумулятора iPhone 13', price: 3500, duration: '30-60 мин' },
    { id: '5', category: 'Батарея', name: 'Замена аккумулятора iPhone 12', price: 3000, duration: '30-60 мин' },
    { id: '6', category: 'Батарея', name: 'Замена аккумулятора Samsung', price: 2500, duration: '30-60 мин' },
    { id: '7', category: 'Зарядка', name: 'Замена разъёма Lightning', price: 2500, duration: '1 час' },
    { id: '8', category: 'Зарядка', name: 'Замена разъёма USB-C', price: 2000, duration: '1 час' },
    { id: '9', category: 'Камера', name: 'Замена основной камеры', price: 4500, duration: '1-2 часа' },
    { id: '10', category: 'Камера', name: 'Замена фронтальной камеры', price: 3500, duration: '1 час' },
    { id: '11', category: 'Диагностика', name: 'Бесплатная диагностика', price: 0, duration: '15-30 мин' },
    { id: '12', category: 'Программное', name: 'Перепрошивка устройства', price: 1500, duration: '1-2 часа' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    inProgress: orders.filter(o => o.status === 'diagnostics' || o.status === 'repair').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.reduce((sum, o) => sum + o.cost, 0),
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Icon name="Wrench" size={36} className="text-primary" />
              Панель администратора
            </h1>
            <p className="text-muted-foreground mt-1">Управление ремонтами и заказами</p>
          </div>
          <Button size="lg" className="gap-2">
            <Icon name="Plus" size={20} />
            Новый заказ
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-scale animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.total}</div>
                <Icon name="FileText" size={24} className="text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Новые</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.new}</div>
                <Icon name="Bell" size={24} className="text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">В работе</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.inProgress}</div>
                <Icon name="Settings" size={24} className="text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Выручка</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.revenue.toLocaleString()} ₽</div>
                <Icon name="DollarSign" size={24} className="text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="orders" className="gap-2">
              <Icon name="ClipboardList" size={18} />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Icon name="DollarSign" size={18} />
              Прайс-лист
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <CardTitle>Управление заказами</CardTitle>
                    <CardDescription>Отслеживание статуса ремонтов</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Input
                      placeholder="Поиск по клиенту, устройству..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="md:w-64"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все статусы</SelectItem>
                        <SelectItem value="new">Новый</SelectItem>
                        <SelectItem value="diagnostics">Диагностика</SelectItem>
                        <SelectItem value="repair">Ремонт</SelectItem>
                        <SelectItem value="completed">Завершён</SelectItem>
                        <SelectItem value="issued">Выдан</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Устройство</TableHead>
                      <TableHead>Проблема</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Стоимость</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="animate-fade-in">
                        <TableCell className="font-mono font-semibold">{order.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{order.client}</div>
                          <div className="text-sm text-muted-foreground">{order.phone}</div>
                        </TableCell>
                        <TableCell>{order.device}</TableCell>
                        <TableCell>{order.issue}</TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[order.status]} text-white`}>
                            {statusLabels[order.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {order.cost > 0 ? `${order.cost.toLocaleString()} ₽` : '—'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{order.date}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Новый</SelectItem>
                              <SelectItem value="diagnostics">Диагностика</SelectItem>
                              <SelectItem value="repair">Ремонт</SelectItem>
                              <SelectItem value="completed">Завершён</SelectItem>
                              <SelectItem value="issued">Выдан</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Прайс-лист услуг</CardTitle>
                    <CardDescription>Актуальные цены на ремонт</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Icon name="Download" size={18} />
                    Экспорт
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {['Экран', 'Батарея', 'Зарядка', 'Камера', 'Диагностика', 'Программное'].map((category) => (
                    <div key={category} className="animate-fade-in">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Icon name="Wrench" size={20} className="text-primary" />
                        {category}
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Услуга</TableHead>
                            <TableHead>Цена</TableHead>
                            <TableHead>Время выполнения</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {services
                            .filter((service) => service.category === category)
                            .map((service) => (
                              <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell className="font-semibold text-primary">
                                  {service.price > 0 ? `${service.price.toLocaleString()} ₽` : 'Бесплатно'}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{service.duration}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}