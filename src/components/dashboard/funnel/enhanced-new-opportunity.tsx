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
import { MoneyMask, toMoney } from '@/utils/utilities';
import { useEffect, useState } from 'react';
import {
  fetchCollaborators,
  Collaborator,
} from '@/services/dashboard/funnel/collaborators';
import { X } from 'lucide-react';

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
  const [amountRaw, setAmountRaw] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchCollaborators().then(setCollaborators);
  }, []);

  const handleSubmit = () => {
    if (formData.username && formData.phone && formData.amount && onSubmit) {
      onSubmit({
        username: formData.username,
        phone: formData.phone,
        amount: formData.amount,
        message: formData.message || 'Nova oportunidade criada',
        tags: formData.tags,
      });
      setFormData({
        username: '',
        phone: '',
        amount: '',
        message: '',
        tags: ['Novo Lead'],
        collaboratorId: '',
      });
      setAmountRaw('');
      setTagInput('');
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && tagInput === '' && formData.tags.length > 0) {
      // Remove last tag if backspace is pressed on empty input
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.slice(0, -1)
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const { data, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });

  const Contacts = () => {
    return (
      <>
        {data ? (
          data.map((e) => (
            <SelectItem key={e.id} className="cursor-pointer" value={e.name}>
              {e.name}
            </SelectItem>
          ))
        ) : (
          <></>
        )}
      </>
    );
  };

  const SkeletonDialog = () => {
    return (
      <main className="flex flex-col gap-4">
        <hr className="border-gray-200 my-4" />
        <div>
          <Skeleton className="p-2 pl-0 h-3 w-1/2"></Skeleton>
          <Skeleton className="h-6 w-full"></Skeleton>
          <Skeleton className="my-2 h2 w-1/2"></Skeleton>
        </div>
        <div>
          <Skeleton className="p-2 pl-0 h-3 w-1/2"></Skeleton>
          <Skeleton className="h-6 w-full"></Skeleton>
        </div>
        <div>
          <Skeleton className="p-2 pl-0 h-3 w-1/2"></Skeleton>
          <Skeleton className="h-6 w-full"></Skeleton>
        </div>
        <div>
          <Skeleton className="p-2 pl-0 h-3 w-1/2"></Skeleton>
          <Skeleton className="h-6 w-full"></Skeleton>
        </div>
      </main>
    );
  };

  const BodyDialog = () => {
    return (
      <main className="flex flex-col gap-4">
        <hr className="border-gray-200 my-4" />

        <div>
          <h2 className="text-gray-600 text-small-loomis p-2 pl-0">Cliente</h2>
          <Select
            value={formData.username}
            onValueChange={(value) => {
              const contact = data?.find((contact) => contact.name === value);
              setFormData((prev) => ({
                ...prev,
                username: value,
                phone: contact?.phone || '',
              }));
            }}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <Contacts />
            </SelectContent>
          </Select>
          <p className="text-gray-400 my-2 text-details-loomis">
            Caso não encontre o cliente na lista, crie o contato dele aqui:{' '}
            <button className="underline text-green-loomis cursor-pointer">
              Criar Contato
            </button>{' '}
          </p>
        </div>

        <div>
          <h2 className="text-gray-600 text-small-loomis p-2 pl-0">
            Colaborador Vinculado
          </h2>
          <Select
            value={formData.collaboratorId}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                collaboratorId: value,
              }))
            }
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {collaborators.map((c) => (
                <SelectItem key={c.id} className="cursor-pointer" value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h2 className="text-gray-600 text-small-loomis p-2 pl-0">Valor</h2>
          <LoomisInputText
            type="text"
            placeholder={toMoney(0)}
            value={MoneyMask(amountRaw)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              setAmountRaw(raw);
              setFormData((prev) => ({
                ...prev,
                amount: MoneyMask(raw),
              }));
            }}
          />
        </div>

        <div>
          <h2 className="text-gray-600 text-small-loomis p-2 pl-0">Tags</h2>
          
          {/* Tags Display */}
          <div className="flex flex-wrap gap-2 mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50 min-h-[44px]">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          {/* Tag Input */}
          <LoomisInputText
            value={tagInput}
            placeholder="Digite uma tag e pressione Enter ou vírgula"
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInput}
            className="w-full"
          />
          <p className="text-gray-400 mt-1 text-details-loomis">
            Use Enter ou vírgula (,) para adicionar tags. Backspace para remover a última tag.
          </p>
        </div>

        <div>
          <h2 className="text-gray-600 text-small-loomis p-2 pl-0">Mensagem (Opcional)</h2>
          <LoomisInputText
            value={formData.message}
            placeholder="Descreva a oportunidade..."
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                message: e.target.value
              }))
            }
          />
        </div>
      </main>
    );
  };

  return (
    <Dialog onOpenChange={onClose} modal={true} open={show}>
      <DialogContent className="min-w-[30vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Oportunidade</DialogTitle>
        </DialogHeader>
        {isLoading ? <SkeletonDialog /> : <BodyDialog />}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="bg-transparent text-green-loomis cursor-pointer hover:bg-green-loomis-light hover:text-green-loomis active:scale-90 border-0"
              variant="outline"
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