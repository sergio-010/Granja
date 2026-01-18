'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getExpenses, createExpense, deleteExpense } from '@/lib/actions/expense-actions';
import { Expense, User, PaymentMethod } from '@prisma/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ConfirmDialog } from '@/components/confirm-dialog';

type ExpenseWithUser = Expense & {
  createdBy: Pick<User, 'email'>;
};

const CATEGORIES = [
  'Medicamentos',
  'Suministros',
  'Equipamiento',
  'Servicios',
  'Alquiler',
  'Salarios',
  'Marketing',
  'Servicios Públicos',
  'Mantenimiento',
  'Otro',
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseWithUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    paymentMethod: 'CASH' as PaymentMethod | '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await getExpenses() as ExpenseWithUser[];
      setExpenses(data);
    } catch (error) {
      toast.error('Error al cargar gastos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setExpenseToDelete(id);
    setConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    
    try {
      await deleteExpense(expenseToDelete);
      toast.success('Gasto eliminado');
      loadExpenses();
    } catch (error) {
      toast.error('Error al eliminar gasto');
    } finally {
      setConfirmOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      toast.error('Completa los campos obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      
      if (!session?.user?.id) {
        toast.error('No se pudo obtener el usuario actual');
        return;
      }

      await createExpense(
        {
          amount: parseFloat(formData.amount),
          category: formData.category,
          paymentMethod: formData.paymentMethod || undefined,
          notes: formData.notes || undefined,
          date: formData.date ? new Date(formData.date) : new Date(),
        },
        session.user.id
      );

      toast.success('Gasto registrado exitosamente');
      setIsDialogOpen(false);
      setFormData({
        amount: '',
        category: '',
        paymentMethod: 'CASH',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });
      loadExpenses();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar el gasto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return '-';
    const labels: Record<string, string> = {
      CASH: '💵 Efectivo',
      TRANSFER: '🏦 Transferencia',
      CARD: '💳 Tarjeta',
      OTHER: '➕ Otro',
    };
    return labels[method] || method;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-lg border border-red-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-600 to-orange-600 rounded-full">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Gastos
              </h1>
              <p className="text-muted-foreground">
                Registra y gestiona las salidas de dinero
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 h-11 px-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Gasto
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="h-10 px-4 text-base">
          {expenses.length} {expenses.length === 1 ? 'gasto' : 'gastos'} registrados
        </Badge>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4 animate-pulse">
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-muted-foreground font-medium">Cargando gastos...</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <TrendingDown className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-muted-foreground font-medium mb-2">No hay gastos registrados</p>
          <p className="text-sm text-muted-foreground">Los gastos aparecerán aquí una vez registrados</p>
        </div>
      ) : (
        <div className="border-2 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableHead className="font-bold text-base">Fecha</TableHead>
                <TableHead className="font-bold text-base">Categoría</TableHead>
                <TableHead className="font-bold text-base">Monto</TableHead>
                <TableHead className="font-bold text-base">Método Pago</TableHead>
                <TableHead className="font-bold text-base">Notas</TableHead>
                <TableHead className="text-right font-bold text-base">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-red-50 dark:hover:bg-gray-800 transition-colors">
                  <TableCell className="font-medium">
                    {format(new Date(expense.date), 'dd/MM/yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-lg text-red-600">
                    -{formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodLabel(expense.paymentMethod)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {expense.notes || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Gasto</DialogTitle>
            <DialogDescription>
              Completa los datos del gasto
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Método de Pago</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as PaymentMethod })}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">💵 Efectivo</SelectItem>
                  <SelectItem value="TRANSFER">🏦 Transferencia</SelectItem>
                  <SelectItem value="CARD">💳 Tarjeta</SelectItem>
                  <SelectItem value="OTHER">➕ Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                placeholder="Descripción del gasto"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Guardando...' : 'Registrar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar Gasto"
        description="¿Estás seguro de eliminar este gasto? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
