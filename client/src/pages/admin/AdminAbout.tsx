import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/components/admin/AdminLayout';
import { Edit2, Save, X, Info } from 'lucide-react';

const AdminAbout = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutData, setAboutData] = useState({
    title: 'Sobre a ANPERE',
    description: 'A Associação Nacional de Profissionais de Engenharia de Redes e Eletrônica (ANPERE) é uma organização dedicada ao desenvolvimento e promoção da engenharia de redes e eletrônica em Portugal.',
    mission: 'Promover a excelência na engenharia de redes e eletrônica, fomentando o desenvolvimento profissional e técnico dos nossos membros.',
    vision: 'Ser a referência nacional em engenharia de redes e eletrônica, contribuindo para o progresso tecnológico do país.',
    values: 'Inovação, Excelência, Colaboração, Integridade e Desenvolvimento Profissional'
  });

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar os dados
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sobre Nós</h1>
            <p className="text-muted-foreground">
              Gerir informações da página "Sobre a ANPERE"
            </p>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2"
            data-testid="button-edit-about"
          >
            <Edit2 className="w-4 h-4" />
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>

        {/* Current Content Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Informações Atuais
              </CardTitle>
              <CardDescription>
                Visualização do conteúdo atual da página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Título</Label>
                {isEditing ? (
                  <Input
                    value={aboutData.title}
                    onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-lg font-semibold">{aboutData.title}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                {isEditing ? (
                  <Textarea
                    value={aboutData.description}
                    onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                    className="mt-1 min-h-[120px]"
                  />
                ) : (
                  <p className="mt-1 text-muted-foreground">{aboutData.description}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Missão</Label>
                {isEditing ? (
                  <Textarea
                    value={aboutData.mission}
                    onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
                    className="mt-1 min-h-[100px]"
                  />
                ) : (
                  <p className="mt-1 text-muted-foreground">{aboutData.mission}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Visão</Label>
                {isEditing ? (
                  <Textarea
                    value={aboutData.vision}
                    onChange={(e) => setAboutData({ ...aboutData, vision: e.target.value })}
                    className="mt-1 min-h-[100px]"
                  />
                ) : (
                  <p className="mt-1 text-muted-foreground">{aboutData.vision}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Valores</Label>
                {isEditing ? (
                  <Input
                    value={aboutData.values}
                    onChange={(e) => setAboutData({ ...aboutData, values: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-muted-foreground">{aboutData.values}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-end"
            >
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" />
                Cancelar
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAbout;

