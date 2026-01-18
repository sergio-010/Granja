'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ShoppingCart, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { getActiveProducts } from '@/lib/actions/product-actions';
import { createSale } from '@/lib/actions/sale-actions';
import { Product, PaymentMethod } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface CartItem {
  productId: string | null;
  nameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  subtotal: number;
}

export default function POSPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  // Cantidad al agregar
  const [addQuantity, setAddQuantity] = useState(1);

  // Descuento en porcentaje
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Venta libre
  const [freeItemName, setFreeItemName] = useState('');
  const [freeItemPrice, setFreeItemPrice] = useState('');
  const [freeItemQuantity, setFreeItemQuantity] = useState('1');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getActiveProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Error al cargar productos');
    }
  };

  const addToCart = (product: Product, quantity = addQuantity) => {
    const existing = cart.find((item) => item.productId === product.id);

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? {
              ...item,
              quantity: newQuantity,
              subtotal: item.unitPriceSnapshot * newQuantity,
            }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          nameSnapshot: product.name,
          unitPriceSnapshot: Number(product.price),
          quantity: quantity,
          subtotal: Number(product.price) * quantity,
        },
      ]);
    }

    setOpen(false);
    setAddQuantity(1);
    toast.success(`${quantity}x ${product.name} agregado al carrito`);
  };

  const addFreeItem = () => {
    if (!freeItemName || !freeItemPrice) {
      toast.error('Completa nombre y precio');
      return;
    }

    const price = parseFloat(freeItemPrice);
    const quantity = parseInt(freeItemQuantity) || 1;

    if (isNaN(price) || price <= 0) {
      toast.error('Precio inválido');
      return;
    }

    if (quantity < 1) {
      toast.error('Cantidad inválida');
      return;
    }

    setCart([
      ...cart,
      {
        productId: null,
        nameSnapshot: freeItemName,
        unitPriceSnapshot: price,
        quantity: quantity,
        subtotal: price * quantity,
      },
    ]);

    setFreeItemName('');
    setFreeItemPrice('');
    setFreeItemQuantity('1');
    toast.success('Item agregado');
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart(
      cart.map((item, i) =>
        i === index
          ? {
            ...item,
            quantity: newQuantity,
            subtotal: item.unitPriceSnapshot * newQuantity,
          }
          : item
      )
    );
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const subtotalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const discountAmount = (subtotalAmount * discountPercent) / 100;

  const total = Math.max(0, subtotalAmount - discountAmount);

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    if (!paymentMethod) {
      toast.error('Selecciona un método de pago');
      return;
    }

    setIsSubmitting(true);
    try {
      await createSale({
        subtotal: subtotalAmount,
        discountPercent,
        total,
        paymentMethod,
        customerName: customerName || undefined,
        notes: notes || undefined,
        items: cart,
      });

      toast.success('¡Venta registrada exitosamente!');

      // Limpiar formulario
      setCart([]);
      setPaymentMethod('CASH');
      setCustomerName('');
      setNotes('');
      setDiscountPercent(0);
      setAddQuantity(1);

      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar la venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-lg border border-green-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Punto de Venta (POS)
            </h1>
            <p className="text-muted-foreground">
              Registra ventas de forma rápida y sencilla
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel izquierdo: Búsqueda y carrito */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-lg border-t-4 border-t-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                Buscar Producto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Label className="text-sm font-bold mb-2 block">
                      Buscar en Catálogo
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-14 border-2 hover:border-green-500 transition-all text-base"
                        >
                          <Search className="mr-3 h-5 w-5 text-green-600" />
                          <span className="text-muted-foreground">Buscar producto o servicio...</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar..." className="h-12" />
                          <CommandList>
                            <CommandEmpty>No se encontraron productos</CommandEmpty>
                            <CommandGroup>
                              {products.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  onSelect={() => addToCart(product)}
                                  className="cursor-pointer py-3 hover:bg-green-50 dark:hover:bg-gray-800"
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div>
                                      <div className="font-medium">{product.name}</div>
                                      <Badge variant="secondary" className="text-xs mt-1">
                                        {product.type === 'PRODUCT' ? '📦 Producto' : '🛠️ Servicio'}
                                      </Badge>
                                    </div>
                                    <div className="font-bold text-green-600">{formatCurrency(product.price)}</div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="w-48">
                    <Label className="text-sm font-bold mb-2 block text-center text-green-600">
                      CANTIDAD
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={addQuantity}
                      onChange={(e) => setAddQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      placeholder="1"
                      className="h-14 text-center font-bold text-3xl border-2 border-green-500 focus:border-green-600"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-dashed pt-4 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg -mx-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-600 rounded-full">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-base font-bold text-blue-900 dark:text-blue-100">
                    Agregar Producto/Servicio Personalizado
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="freeItemName" className="text-xs font-bold mb-1 block">
                      Nombre del Producto/Servicio
                    </Label>
                    <Input
                      id="freeItemName"
                      placeholder="Ej: Consulta veterinaria"
                      value={freeItemName}
                      onChange={(e) => setFreeItemName(e.target.value)}
                      className="h-11 border-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="freeItemPrice" className="text-xs font-bold mb-1 block">
                        Precio (COP)
                      </Label>
                      <Input
                        id="freeItemPrice"
                        type="number"
                        step="1"
                        placeholder="50000"
                        value={freeItemPrice}
                        onChange={(e) => setFreeItemPrice(e.target.value)}
                        className="h-11 border-2 font-bold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="freeItemQuantity" className="text-xs font-bold mb-1 block">
                        Cantidad
                      </Label>
                      <Input
                        id="freeItemQuantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={freeItemQuantity}
                        onChange={(e) => setFreeItemQuantity(e.target.value)}
                        className="h-11 text-center font-bold border-2"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={addFreeItem}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base font-bold"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar al Carrito
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Carrito ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <ShoppingCart className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground font-medium">El carrito está vacío</p>
                  <p className="text-sm text-muted-foreground mt-1">Busca productos para comenzar</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead className="font-bold">Item</TableHead>
                      <TableHead className="font-bold">Precio</TableHead>
                      <TableHead className="font-bold">Cant.</TableHead>
                      <TableHead className="font-bold">Subtotal</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">{item.nameSnapshot}</TableCell>
                        <TableCell className="text-green-600 font-semibold">{formatCurrency(item.unitPriceSnapshot)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(index, parseInt(e.target.value) || 1)
                            }
                            className="w-20 text-center font-bold border-2"
                          />
                        </TableCell>
                        <TableCell className="font-bold text-lg text-blue-600">
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel derecho: Resumen y pago */}
        <div className="space-y-4">
          <Card className="shadow-lg border-t-4 border-t-purple-500 sticky top-4">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-sm font-bold flex items-center gap-1">
                  Método de Pago <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                >
                  <SelectTrigger id="paymentMethod" className="h-11 border-2 hover:border-purple-500 transition-all">
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
                <Label htmlFor="customerName" className="text-sm font-bold">Cliente (opcional)</Label>
                <Input
                  id="customerName"
                  placeholder="Nombre del cliente"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-11 border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-bold">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Observaciones"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="border-2 resize-none"
                />
              </div>

              <div className="border-t-2 border-dashed pt-4 space-y-3">
                <Label htmlFor="discount" className="text-sm font-bold flex items-center gap-2">
                  <span className="text-orange-600">🏷️</span> Descuento (%)
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                    placeholder="0"
                    className="h-12 text-center font-bold text-xl border-2"
                  />
                  <span className="text-3xl font-bold text-orange-600">%</span>
                </div>
                {discountPercent > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">
                      ✨ Descuento aplicado: {discountPercent}%
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t-2 pt-4 space-y-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg -mx-2">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(subtotalAmount)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-orange-600 dark:text-orange-400 font-medium">
                      Descuento ({discountPercent}%):
                    </span>
                    <span className="text-orange-600 dark:text-orange-400 font-bold">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-3xl font-bold border-t-2 pt-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || cart.length === 0}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Confirmar Venta
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
