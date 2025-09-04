import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PipeItem } from './pipe';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  MessageCircle, 
  User,
  Clock,
  FileText,
  CheckCircle,
  X
} from 'lucide-react';

interface OpportunityDetailsModalProps {
  onClose: () => void;
  show: boolean;
  item: PipeItem | null;
}

export function OpportunityDetailsModal({
  onClose,
  show,
  item,
}: OpportunityDetailsModalProps) {
  if (!item) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="min-w-[960px] min-h-[600px] max-w-5xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Detalhes da Oportunidade
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
          {/* Left Column - Customer Info */}
          <div className="space-y-6">
            {/* Customer Avatar & Basic Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://github.com/${item.username.toLowerCase().replace(' ', '')}.png`} />
                <AvatarFallback className="bg-green-100 text-green-700 font-medium text-lg">
                  {getInitials(item.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.username}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Phone size={14} />
                  <span>{item.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Mail size={14} />
                  <span>{item.username.toLowerCase().replace(' ', '.')}@email.com</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Opportunity Value */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Valor da Oportunidade</h4>
              <p className="text-3xl font-bold text-green-600">{item.amount}</p>
            </div>

            {/* Message */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Mensagem</h4>
              <div className="bg-gray-50 border rounded-lg p-4">
                <p className="text-gray-700">{item.message}</p>
              </div>
            </div>

            {/* Assigned Collaborator */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <User size={16} />
                Colaborador Vinculado
              </h4>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/fernandakipper.png" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                    FK
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">Fernanda Kipper</p>
                  <p className="text-sm text-gray-500">Vendedor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details and Activity */}
          <div className="space-y-6">
            {/* About Client */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-lg">Sobre o Cliente</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">E-mail</span>
                    <p className="font-medium">{item.username.toLowerCase().replace(' ', '.')}@email.com</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Segmento</span>
                    <p className="font-medium">Tecnologia</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Empresa</span>
                    <p className="font-medium">Empresa Exemplo Ltda</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Cargo</span>
                    <p className="font-medium">Diretor de TI</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Localização</span>
                  <p className="font-medium">São Paulo, SP</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* About Opportunity */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-lg">Sobre a Oportunidade</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Estágio</span>
                    <p className="font-medium">Qualificação</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Probabilidade</span>
                    <p className="font-medium">75%</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Previsão de fechamento</span>
                    <p className="font-medium">15 de Janeiro, 2025</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Origem</span>
                    <p className="font-medium">Website</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Produto/Serviço</span>
                    <p className="font-medium">Plataforma de CRM</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Método de contato</span>
                    <p className="font-medium">WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Last Message */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <MessageCircle size={16} />
                Última Mensagem
              </h4>
              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Há 2 horas</span>
                </div>
                <p className="text-sm text-gray-700">
                  Olá {item.username}, gostaria de agendar uma reunião para discutir a proposta?
                </p>
              </div>
            </div>

            {/* Tasks */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle size={16} />
                Tarefas
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm text-gray-700 line-through">Enviar proposta inicial</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Clock size={16} className="text-yellow-600" />
                  <span className="text-sm text-gray-700">Follow-up agendado</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">Preparar contrato</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar size={16} />
                Timeline
              </h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium">Oportunidade criada</p>
                    <p className="text-xs text-gray-500">Hoje, 14:30</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium">Primeiro contato</p>
                    <p className="text-xs text-gray-500">Ontem, 16:45</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium">Lead qualificado</p>
                    <p className="text-xs text-gray-500">2 dias atrás</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}