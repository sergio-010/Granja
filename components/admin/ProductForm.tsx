'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createProduct, updateProduct } from '@/lib/actions/product-actions';
import { Product } from '@prisma/client';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.string().min(1, 'El precio es requerido'),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  type: z.enum(['PRODUCT', 'SERVICE']),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price.toString() || '',
      imageUrl: product?.imageUrl || '',
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      type: product?.type || 'PRODUCT',
    },
  });

  const type = watch('type');
  const isActive = watch('isActive');
  const isFeatured = watch('isFeatured');

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const productData = {
        ...data,
        price: parseFloat(data.price),
      };

      if (product?.id) {
        await updateProduct(product.id, productData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await createProduct(productData);
        toast.success('Producto creado exitosamente');
      }

      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Ej: Consulta Veterinaria"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo *</Label>
        <Select
          value={type}
          onValueChange={(value) => setValue('type', value as 'PRODUCT' | 'SERVICE')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRODUCT">Producto</SelectItem>
            <SelectItem value="SERVICE">Servicio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Precio *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register('price')}
          placeholder="0.00"
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Descripción del producto o servicio"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL de Imagen</Label>
        <Input
          id="imageUrl"
          {...register('imageUrl')}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        <p className="text-xs text-muted-foreground">
          Opcional. Si se deja vacío, se usará un placeholder
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
        />
        <Label htmlFor="isActive" className="font-normal">
          Activo (visible en el sitio público)
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isFeatured"
          checked={isFeatured}
          onCheckedChange={(checked) => setValue('isFeatured', checked as boolean)}
        />
        <Label htmlFor="isFeatured" className="font-normal">
          Destacado (aparece en la landing)
        </Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Guardando...' : product ? 'Actualizar' : 'Crear'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
