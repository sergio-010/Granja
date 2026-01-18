'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
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
import { BannerForm } from '@/components/admin/BannerForm';
import { getBanners, deleteBanner } from '@/lib/actions/banner-actions';
import { Banner } from '@prisma/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ConfirmDialog } from '@/components/confirm-dialog';

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      toast.error('Error al cargar banners');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedBanner(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    setBannerToDelete({ id, title });
    setConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!bannerToDelete) return;
    
    try {
      await deleteBanner(bannerToDelete.id);
      toast.success('Banner eliminado');
      loadBanners();
    } catch (error) {
      toast.error('Error al eliminar banner');
    } finally {
      setConfirmOpen(false);
      setBannerToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedBanner(null);
    loadBanners();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="text-muted-foreground">
            Gestiona los banners de la landing page
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Banner
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Cargando banners...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No hay banners creados
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="font-mono">{banner.order}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{banner.title}</div>
                      {banner.subtitle && (
                        <div className="text-sm text-muted-foreground">
                          {banner.subtitle}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={banner.isActive ? 'default' : 'outline'}>
                      {banner.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {banner.startsAt || banner.endsAt ? (
                      <div className="text-sm">
                        {banner.startsAt && (
                          <div>
                            Desde: {format(new Date(banner.startsAt), 'dd/MM/yyyy', { locale: es })}
                          </div>
                        )}
                        {banner.endsAt && (
                          <div>
                            Hasta: {format(new Date(banner.endsAt), 'dd/MM/yyyy', { locale: es })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Siempre</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(banner)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(banner.id, banner.title)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedBanner ? 'Editar Banner' : 'Nuevo Banner'}
            </DialogTitle>
            <DialogDescription>
              {selectedBanner
                ? 'Actualiza la información del banner'
                : 'Completa los datos para crear un nuevo banner'}
            </DialogDescription>
          </DialogHeader>
          <BannerForm
            banner={selectedBanner}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar Banner"
        description={`¿Estás seguro de eliminar el banner "${bannerToDelete?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
