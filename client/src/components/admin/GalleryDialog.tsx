import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload01Icon as Upload, Cancel01Icon as X, Image01Icon as ImageIcon, File01Icon as FileIcon, Video01Icon as VideoIcon } from "hugeicons-react";
import { CreateGalleryItemData, UpdateGalleryItemData } from '@/hooks/useGallery';

interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  galleryItem?: UpdateGalleryItemData | null;
  onSubmit: (data: CreateGalleryItemData, file?: File) => void;
  isLoading?: boolean;
}

const typeOptions = [
  { value: 'image', label: 'Imagem' },
  { value: 'video', label: 'Vídeo' },
];

const categoryOptions = [
  'Evento',
  'Palestra',
  'Cerimónia',
  'Workshop',
  'Entrevista',
  'Instalações',
  'Reunião',
  'Formação',
  'Networking',
  'Outro',
];

export const GalleryDialog = ({
  open,
  onOpenChange,
  galleryItem,
  onSubmit,
  isLoading = false,
}: GalleryDialogProps) => {
  const [formData, setFormData] = useState<CreateGalleryItemData>({
    title: '',
    description: '',
    type: 'image',
    date: '',
    category: '',
    views: 0,
    duration: '',
    thumbnailUrl: '',
    mediaUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get current date in format "Mês YYYY"
    const getCurrentDate = () => {
      const now = new Date();
      const month = now.toLocaleDateString('pt-PT', { month: 'long' });
      const year = now.getFullYear();
      return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    };

    if (galleryItem) {
      setFormData({
        title: galleryItem.title || '',
        description: galleryItem.description || '',
        type: galleryItem.type || 'image',
        date: galleryItem.date || getCurrentDate(),
        category: galleryItem.category || '',
        views: galleryItem.views || 0,
        duration: galleryItem.duration || '',
        thumbnailUrl: galleryItem.thumbnailUrl || '',
        mediaUrl: galleryItem.mediaUrl || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'image',
        date: getCurrentDate(),
        category: '',
        views: 0,
        duration: '',
        thumbnailUrl: '',
        mediaUrl: '',
      });
    }
    
    // Limpar arquivo selecionado e preview quando dialog abre/fecha
    setSelectedFile(null);
    setPreviewUrl('');
  }, [galleryItem, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('GalleryDialog handleSubmit:', { formData, selectedFile });
    onSubmit(formData, selectedFile || undefined);
  };

  const handleInputChange = (field: keyof CreateGalleryItemData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Criar preview para imagens e vídeos
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setFormData(prev => ({ ...prev, type: 'image' }));
      } else if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setFormData(prev => ({ ...prev, type: 'video' }));
      }
      
      // O arquivo será processado no servidor e a URL será definida automaticamente
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setFormData(prev => ({
      ...prev,
      thumbnailUrl: '',
      mediaUrl: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {galleryItem ? 'Editar Item da Galeria' : 'Novo Item da Galeria'}
          </DialogTitle>
          <DialogDescription>
            {galleryItem 
              ? 'Atualize as informações do item da galeria.'
              : 'Adicione um novo item à galeria.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Conferência Nacional de Telecomunicações 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o item da galeria..."
              rows={3}
              required
            />
          </div>

          {/* Preview da mídia atual (quando editando) */}
          {galleryItem && galleryItem.mediaUrl && !selectedFile && (
            <div className="space-y-2">
              <Label>{galleryItem.type === 'video' ? 'Vídeo Atual' : 'Imagem Atual'}</Label>
              <div className="relative">
                {galleryItem.type === 'video' ? (
                  <video
                    src={galleryItem.mediaUrl}
                    controls
                    className="w-full h-32 sm:h-48 object-cover rounded-lg border"
                  />
                ) : (
                  <img
                    src={galleryItem.mediaUrl}
                    alt="Imagem atual"
                    className="w-full h-32 sm:h-48 object-cover rounded-lg border"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, mediaUrl: '', thumbnailUrl: '' }))}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Campo de Upload */}
          <div className="space-y-2">
            <Label>Arquivo</Label>
            <div className="space-y-4">
              {/* Input de arquivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              {/* Botão de upload */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Upload className="w-4 h-4" />
                  Selecionar Arquivo
                </Button>
                
                {selectedFile && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4" />
                      <span className="truncate">{selectedFile.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>({formatFileSize(selectedFile.size)})</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Preview da mídia (imagem ou vídeo) */}
              {previewUrl && (
                <div className="relative">
                  {formData.type === 'video' ? (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-32 sm:h-48 object-cover rounded-lg border"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-32 sm:h-48 object-cover rounded-lg border"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Informações sobre tipos de arquivo */}
              <p className="text-xs text-muted-foreground">
                Formatos suportados: Imagens (JPG, PNG, GIF) ou Vídeos (MP4, MOV, AVI) - máx. 50MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value as 'image' | 'video')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              placeholder="Ex: Junho 2024"
              required
            />
            <p className="text-xs text-muted-foreground">
              Data preenchida automaticamente. Pode editar se necessário.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="views">Visualizações (opcional)</Label>
              <Input
                id="views"
                type="number"
                value={formData.views}
                onChange={(e) => handleInputChange('views', parseInt(e.target.value) || 0)}
                placeholder="Ex: 1250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (opcional)</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="Ex: 45 min"
              />
            </div>
          </div>


          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Salvando...' : galleryItem ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
