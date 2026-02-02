import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Settings01Icon as Settings,
  PaintBoardIcon as Palette,
  Globe02Icon as Globe,
  Notification01Icon as Bell,
  FloppyDiskIcon as Save,
  RefreshIcon as RotateCcw,
  Moon02Icon as Moon,
  Sun01Icon as Sun,
  ComputerIcon as Monitor,
  TranslateIcon as Languages,
  Calendar03Icon as Calendar,
  Clock01Icon as Clock,
  Layout01Icon as Layout,
  CheckmarkCircle02Icon as CheckCircle2
} from "hugeicons-react";
import { useSystemSettings, type Theme, type Language } from '@/hooks/useSystemSettings';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();
  const { settings, updateSetting, resetSettings } = useSystemSettings();
  const [hasChanges, setHasChanges] = useState(false);

  const handleThemeChange = (theme: Theme) => {
    updateSetting('theme', theme);
    setHasChanges(true);
    toast({
      title: 'Tema atualizado',
      description: `Tema alterado para ${theme === 'auto' ? 'automático' : theme === 'dark' ? 'escuro' : 'claro'}`,
    });
  };

  const handleLanguageChange = (language: Language) => {
    updateSetting('language', language);
    setHasChanges(true);
    toast({
      title: 'Idioma atualizado',
      description: `Idioma alterado para ${language === 'pt' ? 'Português' : language === 'en' ? 'Inglês' : 'Espanhol'}`,
    });
  };

  const handleToggle = (key: keyof typeof settings, label: string) => {
    const newValue = !settings[key] as boolean;
    updateSetting(key, newValue);
    setHasChanges(true);
    toast({
      title: `${label} ${newValue ? 'ativado' : 'desativado'}`,
    });
  };

  const handleDateFormatChange = (format: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd') => {
    updateSetting('dateFormat', format);
    setHasChanges(true);
    toast({
      title: 'Formato de data atualizado',
    });
  };

  const handleTimeFormatChange = (format: '12h' | '24h') => {
    updateSetting('timeFormat', format);
    setHasChanges(true);
    toast({
      title: 'Formato de hora atualizado',
    });
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      resetSettings();
      setHasChanges(false);
      toast({
        title: 'Configurações restauradas',
        description: 'Todas as configurações foram restauradas para os valores padrão.',
      });
  }
  };

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'auto':
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getLanguageName = (lang: Language) => {
    switch (lang) {
      case 'pt':
        return 'Português';
      case 'en':
        return 'English';
      case 'es':
        return 'Español';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
            <p className="text-muted-foreground">
              Personalize a aparência e comportamento do sistema
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm text-green-600"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Alterações salvas automaticamente</span>
              </motion.div>
            )}
          <Button 
              variant="outline"
              onClick={handleReset}
            className="gap-2"
          >
              <RotateCcw className="w-4 h-4" />
              Restaurar Padrões
          </Button>
          </div>
        </div>

        {/* Appearance Settings */}
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize o tema e cores do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label htmlFor="theme">Tema</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['light', 'dark', 'auto'] as Theme[]).map((theme) => (
                  <motion.button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={`
                      flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                      ${settings.theme === theme
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {getThemeIcon(theme)}
                    <span className="text-sm font-medium">
                      {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Automático'}
                    </span>
                  </motion.button>
                ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
        {/* Language Settings */}
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Idioma
            </CardTitle>
            <CardDescription>
              Selecione o idioma preferido do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="language">Idioma do Sistema</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleLanguageChange(value as Language)}
              >
                <SelectTrigger id="language" className="w-full sm:w-[300px]">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">
                    <div className="flex items-center gap-2">
                      <span>🇵🇹</span>
                      <span>Português</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <span>🇬🇧</span>
                      <span>English</span>
                </div>
                  </SelectItem>
                  <SelectItem value="es">
                    <div className="flex items-center gap-2">
                      <span>🇪🇸</span>
                      <span>Español</span>
                </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Idioma atual: <strong>{getLanguageName(settings.language)}</strong>
              </p>
              </div>
            </CardContent>
          </Card>
          
        {/* Date & Time Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Data e Hora
            </CardTitle>
            <CardDescription>
              Configure o formato de exibição de datas e horas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Format */}
              <div className="space-y-3">
                <Label htmlFor="dateFormat">Formato de Data</Label>
                <Select
                  value={settings.dateFormat}
                  onValueChange={(value) => handleDateFormatChange(value as 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd')}
                >
                  <SelectTrigger id="dateFormat" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY (31/12/2024)</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY (12/31/2024)</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD (2024-12-31)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Format */}
              <div className="space-y-3">
                <Label htmlFor="timeFormat">Formato de Hora</Label>
                <Select
                  value={settings.timeFormat}
                  onValueChange={(value) => handleTimeFormatChange(value as '12h' | '24h')}
                >
                  <SelectTrigger id="timeFormat" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 horas (14:30)</SelectItem>
                    <SelectItem value="12h">12 horas (2:30 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>
              Opções gerais de comportamento do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notificações
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações sobre eventos e atualizações
                </p>
          </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={() => handleToggle('notifications', 'Notificações')}
              />
                        </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoSave" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Salvamento Automático
                </Label>
                <p className="text-sm text-muted-foreground">
                  Salvar automaticamente as alterações feitas nos formulários
                </p>
                        </div>
              <Switch
                id="autoSave"
                checked={settings.autoSave}
                onCheckedChange={() => handleToggle('autoSave', 'Salvamento automático')}
              />
                      </div>

            {/* Compact Mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compactMode" className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Modo Compacto
                </Label>
                <p className="text-sm text-muted-foreground">
                  Reduzir espaçamentos para exibir mais conteúdo
                </p>
                      </div>
              <Switch
                id="compactMode"
                checked={settings.compactMode}
                onCheckedChange={() => handleToggle('compactMode', 'Modo compacto')}
              />
                    </div>
                  </CardContent>
                </Card>

        {/* Current Settings Summary */}
          <Card>
          <CardHeader>
            <CardTitle>Resumo das Configurações</CardTitle>
            <CardDescription>
              Visualize todas as configurações atuais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Tema:</p>
                <p className="text-sm text-muted-foreground">
                  {settings.theme === 'light' ? 'Claro' : settings.theme === 'dark' ? 'Escuro' : 'Automático'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Idioma:</p>
                <p className="text-sm text-muted-foreground">
                  {getLanguageName(settings.language)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Formato de Data:</p>
                <p className="text-sm text-muted-foreground">
                  {settings.dateFormat}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Formato de Hora:</p>
                <p className="text-sm text-muted-foreground">
                  {settings.timeFormat}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Notificações:</p>
                <p className="text-sm text-muted-foreground">
                  {settings.notifications ? 'Ativadas' : 'Desativadas'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Salvamento Automático:</p>
                <p className="text-sm text-muted-foreground">
                  {settings.autoSave ? 'Ativado' : 'Desativado'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Modo Compacto:</p>
                <p className="text-sm text-muted-foreground">
                  {settings.compactMode ? 'Ativado' : 'Desativado'}
                </p>
              </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
