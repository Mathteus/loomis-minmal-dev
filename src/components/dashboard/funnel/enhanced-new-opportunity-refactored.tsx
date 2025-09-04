import { LoomisButton } from '@/components/generics/loomis-button';
import { LoomisInputText } from '@/components/generics/loomis-input-text';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getContacts } from '@/services/dashboard/chat/contacts';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchCollaborators,
  Collaborator,
} from '@/services/dashboard/funnel/collaborators';

import { PipeItem } from './pipe';

interface EnhancedNewOpportunityModalProps {
  onClose: () => void;
  show: boolean;
  onSubmit?: (data: Omit<PipeItem, 'id'>) => void;
}

export function EnhancedNewOpportunityModal({
  onClose,
  show,
  onSubmit,
}: EnhancedNewOpportunityModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    amount: '',
    message: '',
    tags: ['Novo Lead'] as string[],
    collaboratorId: '',
  });
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Função para formatar valor monetário
  const formatMoney = useCallback((value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const number = parseInt(numericValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(number);
  }, []);

  useEffect(() => {
    fetchCollaborators().then(setCollaborators);
  }, []);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formattedValue = formatMoney(rawValue);
    setFormData(prev => ({
      ...prev,
      amount: formattedValue,
    }));
  }, [formatMoney]);

  const handleAddTag = useCallback(() => {
    const newTag = tagInput.trim();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);

  const handleRemoveTag = useCallback((tagIndex: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== tagIndex),
    }));
  }, []);

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  const handleSubmit = useCallback(() => {
    console.log('handleSubmit called with formData:', formData);
    if (formData.username && formData.phone && formData.amount && onSubmit) {
      const opportunityData = {
        username: formData.username,
        phone: formData.phone,
        amount: formData.amount,
        message: formData.message || 'Nova oportunidade criada',
        tags: formData.tags,
      };
      console.log('Calling onSubmit with:', opportunityData);
      onSubmit(opportunityData);
      
      // Reset form
      setFormData({
        username: '',
        phone: '',
        amount: '',
        message: '',
        tags: ['Novo Lead'],
        collaboratorId: '',
      });
      setTagInput('');
      onClose();
    } else {
      console.log('Form validation failed:', {
        username: formData.username,
        phone: formData.phone,
        amount: formData.amount,
        onSubmit: !!onSubmit
      });
    }
  }, [formData, onSubmit, onClose]);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });

  const handleContactSelect = useCallback((value: string) => {
    const contact = contacts?.find((contact) => contact.name === value);
    setFormData(prev => ({
      ...prev,
      username: value,
      phone: contact?.phone || '',
    }));
  }, [contacts]);

  if (isLoading) {
    return (
      <Dialog open={show} onOpenChange={onClose} modal={true}>
        <DialogContent className="min-w-[30vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Oportunidade</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <hr className="border-gray-200 my-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={show} onOpenChange={onClose} modal={true}>
      <DialogContent className="min-w-[30vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Oportunidade</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          <hr className="border-gray-200 my-4" />

          <div>
            <h2 className="text-gray-600 text-small-loomis p-2 pl-0">Cliente</h2>
            <Select value={formData.username} onValueChange={handleContactSelect}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {contacts?.map((contact) => (
                  <SelectItem key={contact.id} className="cursor-pointer" value={contact.name}>
                    {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-gray-400 my-2 text-details-loomis">
              Caso não encontre o cliente na lista, crie o contato dele aqui:{' '}
              <button className="underline text-green-loomis cursor-pointer">
                Criar Contato
              </button>
            </p>
          </div>

          <div>
            <h2 className="text-gray-600 text-small-loomis p-2 pl-0">
              Colaborador Vinculado
            </h2>
            <Select
              value={formData.collaboratorId}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, collaboratorId: value }))
              }
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {collaborators.map((collaborator) => (
                  <SelectItem key={collaborator.id} className="cursor-pointer" value={collaborator.id}>
                    {collaborator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="text-gray-600 text-small-loomis p-2 pl-0">Valor</h2>
            <LoomisInputText
              type="text"
              placeholder="R$ 0,00"
              value={formData.amount}
              onChange={handleAmountChange}
              autoComplete="off"
            />
          </div>

          <div>
            <h2 className="text-gray-600 text-small-loomis p-2 pl-0">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-green-loomis-light text-green-loomis py-1 px-3 text-details-loomis rounded-2xl inline-flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 hover:bg-green-loomis hover:text-white rounded-full w-4 h-4 flex items-center justify-center text-xs transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <LoomisInputText
              value={tagInput}
              placeholder="Digite as tags e pressione Enter ou vírgula"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
          </div>

          <div>
            <h2 className="text-gray-600 text-small-loomis p-2 pl-0">Mensagem (Opcional)</h2>
            <LoomisInputText
              value={formData.message}
              placeholder="Digite uma mensagem..."
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-transparent text-green-loomis cursor-pointer hover:bg-green-loomis-light hover:text-green-loomis active:scale-90 border-green-loomis"
            >
              Cancelar
            </Button>
          </DialogClose>
          <LoomisButton
            className="w-max"
            type="submit"
            disabled={!formData.username || !formData.amount}
            onClick={handleSubmit}
          >
            Adicionar oportunidade
          </LoomisButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}