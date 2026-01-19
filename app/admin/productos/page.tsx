'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from '@/components/admin/ProductForm';
import { getProducts, deleteProduct } from '@/lib/actions/product-actions';
import { Product } from '@prisma/client';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    setProductToDelete({ id, name });
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      toast.success('Producto eliminado');
      loadProducts();
    } catch (error) {
      toast.error('Error al eliminar producto');
    } finally {
      setConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    loadProducts();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-4 lg:p-6 rounded-lg border border-blue-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full">
              <Package className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Productos y Servicios
              </h1>
              <p className="text-muted-foreground">
                Gestiona el catálogo de productos y servicios
              </p>
            </div>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11 px-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 border-2 text-base"
          />
        </div>
        <Badge variant="secondary" className="h-12 px-4 text-base">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
        </Badge>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4 animate-pulse">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-muted-foreground font-medium">Cargando productos...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-muted-foreground font-medium mb-2">No se encontraron productos</p>
          <p className="text-sm text-muted-foreground">Intenta con otro término de búsqueda</p>
        </div>
      ) : (
        <>
          {/* Vista de tabla en desktop */}
          <div className="hidden md:block border-2 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableHead className="font-bold text-base">Nombre</TableHead>
                  <TableHead className="font-bold text-base">Tipo</TableHead>
                  <TableHead className="font-bold text-base">Precio</TableHead>
                  <TableHead className="font-bold text-base">Estado</TableHead>
                  <TableHead className="font-bold text-base">Destacado</TableHead>
                  <TableHead className="text-right font-bold text-base">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                    <TableCell className="font-semibold text-base">{product.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.type === 'PRODUCT' ? 'default' : 'secondary'}
                        className="font-medium"
                      >
                        {product.type === 'PRODUCT' ? '📦 Producto' : '🛠️ Servicio'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-green-600 text-base">{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isActive ? 'default' : 'outline'}
                        className={product.isActive ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {product.isActive ? '✓ Activo' : '✕ Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.isFeatured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                          ⭐ Destacado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 transition-all"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id, product.name)}
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

          {/* Vista de tarjetas en móvil */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <Card key={product.id} className="border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        className="hover:bg-blue-100 hover:text-blue-600 h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id, product.name)}
                        className="hover:bg-red-100 hover:text-red-600 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={product.type === 'PRODUCT' ? 'default' : 'secondary'}>
                      {product.type === 'PRODUCT' ? '📦 Producto' : '🛠️ Servicio'}
                    </Badge>
                    {product.isActive && (
                      <Badge variant="outline" className="border-green-500 text-green-600">✓ Activo</Badge>
                    )}
                    {product.isFeatured && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">⭐ Destacado</Badge>
                    )}
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Precio</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(product.price)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct
                ? 'Actualiza la información del producto'
                : 'Completa los datos para crear un nuevo producto o servicio'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            product={selectedProduct}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar Producto"
        description={`¿Estás seguro de eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
