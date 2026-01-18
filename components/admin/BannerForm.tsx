'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { createBanner, updateBanner } from '@/lib/actions/banner-actions';
import { Banner } from '@prisma/client';

const bannerSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().optional(),
  imageUrl: z.string().url('URL de imagen inválida'),
  buttonText: z.string().optional(),
  linkUrl: z.string().optional(),
  order: z.string(),
  isActive: z.boolean(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  banner?: Banner | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BannerForm({ banner, onSuccess, onCancel }: BannerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: banner?.title || '',
      subtitle: banner?.subtitle || '',
      imageUrl: banner?.imageUrl || '',
      buttonText: banner?.buttonText || '',
      linkUrl: banner?.linkUrl || '',
      order: banner?.order.toString() || '0',
      isActive: banner?.isActive ?? true,
      startsAt: banner?.startsAt ? new Date(banner.startsAt).toISOString().split('T')[0] : '',
      endsAt: banner?.endsAt ? new Date(banner.endsAt).toISOString().split('T')[0] : '',
    },
  });

  const isActive = watch('isActive');

  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true);
    try {
      const bannerData = {
        title: data.title,
        subtitle: data.subtitle || undefined,
        imageUrl: data.imageUrl,
        buttonText: data.buttonText || undefined,
        linkUrl: data.linkUrl || undefined,
        order: parseInt(data.order),
        isActive: data.isActive,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      };

      if (banner?.id) {
        await updateBanner(banner.id, bannerData);
        toast.success('Banner actualizado exitosamente');
      } else {
        await createBanner(bannerData);
        toast.success('Banner creado exitosamente');
      }
      
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar el banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Ej: Bienvenidos a Nuestra Veterinaria"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Input
          id="subtitle"
          {...register('subtitle')}
          placeholder="Texto secundario del banner"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL de Imagen *</Label>
        <Input
          id="imageUrl"
          {...register('imageUrl')}
          placeholder="https://ejemplo.com/banner.jpg"
        />
        {errors.imageUrl && (
          <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Recomendado: 1200x400px
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buttonText">Texto del Botón</Label>
          <Input
            id="buttonText"
            {...register('buttonText')}
            placeholder="Ej: Ver Servicios"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkUrl">URL del Enlace</Label>
          <Input
            id="linkUrl"
            {...register('linkUrl')}
            placeholder="/productos"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Orden</Label>
        <Input
          id="order"
          type="number"
          {...register('order')}
          placeholder="0"
        />
        <p className="text-xs text-muted-foreground">
          Menor número aparece primero
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startsAt">Fecha de Inicio</Label>
          <Input
            id="startsAt"
            type="date"
            {...register('startsAt')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endsAt">Fecha de Fin</Label>
          <Input
            id="endsAt"
            type="date"
            {...register('endsAt')}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
        />
        <Label htmlFor="isActive" className="font-normal">
          Activo (visible en el sitio)
        </Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Guardando...' : banner ? 'Actualizar' : 'Crear'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
