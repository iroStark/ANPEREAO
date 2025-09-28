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
import { Upload, X, ImageIcon, FileIcon } from 'lucide-react';
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
    if (galleryItem) {
      setFormData({
        title: galleryItem.title || '',
        description: galleryItem.description || '',
        type: galleryItem.type || 'image',
        date: galleryItem.date || '',
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
        date: '',
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
    onSubmit(formData, selectedFile || undefined);
  };

  const handleInputChange = (field: keyof CreateGalleryItemData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Criar preview para imagens
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setFormData(prev => ({ ...prev, type: 'image' }));
      } else if (file.type.startsWith('video/')) {
        setFormData(prev => ({ ...prev, type: 'video' }));
      }
      
      // Atualizar URLs com o nome do arquivo (será substituído pela URL real após upload)
      const fileName = file.name;
      setFormData(prev => ({
        ...prev,
        thumbnailUrl: file.type.startsWith('image/') ? fileName : prev.thumbnailUrl,
        mediaUrl: fileName,
      }));
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

          {/* Preview da imagem atual (quando editando) */}
          {galleryItem && galleryItem.mediaUrl && !selectedFile && (
            <div className="space-y-2">
              <Label>Imagem Atual</Label>
              <div className="relative">
                <img
                  src={galleryItem.mediaUrl}
                  alt="Imagem atual"
                  className="w-full h-32 sm:h-48 object-cover rounded-lg border"
                />
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
              
              {/* Preview da imagem */}
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-32 sm:h-48 object-cover rounded-lg border"
                  />
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
                Formatos suportados: JPG, PNG, GIF, MP4, MOV, AVI (máx. 10MB)
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

          {/* Campos de URL (para URLs externas) */}
          <div className="space-y-2">
            <Label htmlFor="mediaUrl">URL do Mídia (opcional)</Label>
            <Input
              id="mediaUrl"
              type="url"
              value={formData.mediaUrl}
              onChange={(e) => handleInputChange('mediaUrl', e.target.value)}
              placeholder="https://exemplo.com/media.jpg ou .mp4"
            />
            <p className="text-xs text-muted-foreground">
              Use este campo para URLs externas ou deixe vazio se estiver fazendo upload de arquivo
            </p>
          </div>

          {formData.type === 'image' && (
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">URL da Miniatura (opcional)</Label>
              <Input
                id="thumbnailUrl"
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                placeholder="https://exemplo.com/miniatura.jpg"
              />
            </div>
          )}

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
