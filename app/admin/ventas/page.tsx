'use client';

import { useState, useEffect } from 'react';
import { Trash2, Eye, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
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
import { getSales, deleteSale } from '@/lib/actions/sale-actions';
import { Sale, SaleItem, Product, User } from '@prisma/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ConfirmDialog } from '@/components/confirm-dialog';

type SaleWithDetails = Sale & {
  items: (SaleItem & { product: Product | null })[];
  createdBy: Pick<User, 'email'>;
};

export default function SalesPage() {
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [selectedSale, setSelectedSale] = useState<SaleWithDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setIsLoading(true);
    try {
      const data = await getSales() as SaleWithDetails[];
      setSales(data);
    } catch (error) {
      toast.error('Error al cargar ventas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaleToDelete(id);
    setConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!saleToDelete) return;
    
    try {
      await deleteSale(saleToDelete);
      toast.success('Venta eliminada');
      loadSales();
    } catch (error) {
      toast.error('Error al eliminar venta');
    } finally {
      setConfirmOpen(false);
      setSaleToDelete(null);
    }
  };

  const handleView = (sale: SaleWithDetails) => {
    setSelectedSale(sale);
    setIsDialogOpen(true);
  };

  const getPaymentMethodLabel = (method: string) => {
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
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-lg border border-green-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Historial de Ventas</h1>
            <p className="text-muted-foreground">
              Consulta y gestiona todas las ventas registradas
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="h-10 px-4 text-base">
          {sales.length} {sales.length === 1 ? 'venta' : 'ventas'} registradas
        </Badge>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4 animate-pulse">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-muted-foreground font-medium">Cargando ventas...</p>
        </div>
      ) : sales.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-muted-foreground font-medium mb-2">No hay ventas registradas</p>
          <p className="text-sm text-muted-foreground">Las ventas aparecerán aquí una vez realizadas</p>
        </div>
      ) : (
        <div className="border-2 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableHead className="font-bold text-base">Fecha</TableHead>
                <TableHead className="font-bold text-base">Cliente</TableHead>
                <TableHead className="font-bold text-base">Items</TableHead>
                <TableHead className="font-bold text-base">Método Pago</TableHead>
                <TableHead className="font-bold text-base">Total</TableHead>
                <TableHead className="text-right font-bold text-base">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id} className="hover:bg-green-50 dark:hover:bg-gray-800 transition-colors">
                  <TableCell className="font-medium">
                    {format(new Date(sale.date), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </TableCell>
                  <TableCell className="font-medium">{sale.customerName || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getPaymentMethodLabel(sale.paymentMethod)}</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-lg text-green-600">{formatCurrency(sale.total)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(sale)}
                        className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 transition-all"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sale.id)}
                        className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Venta</DialogTitle>
            <DialogDescription>
              Información completa de la venta
            </DialogDescription>
          </DialogHeader>
          
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium">
                    {format(new Date(selectedSale.date), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Método de Pago</p>
                  <p className="font-medium">
                    {getPaymentMethodLabel(selectedSale.paymentMethod)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedSale.customerName || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registrado por</p>
                  <p className="font-medium">{selectedSale.createdBy.email}</p>
                </div>
              </div>

              {selectedSale.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notas</p>
                  <p className="font-medium">{selectedSale.notes}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Precio Unit.</TableHead>
                      <TableHead>Cant.</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSale.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.nameSnapshot}</TableCell>
                        <TableCell>{formatCurrency(item.unitPriceSnapshot)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar Venta"
        description="¿Estás seguro de eliminar esta venta? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
