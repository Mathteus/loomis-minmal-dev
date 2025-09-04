'use client';

import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  EllipsisVertical,
  Share2,
  PlusCircle,
  SquarePen,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NoOpportunity } from '@/components/dashboard/funnel/no-opportunity';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CreatePipe } from '@/components/dashboard/funnel/create-pipe';
import ConfigColumnsDialog from '@/components/dashboard/funnel/config-pipes';
import { PipeItem } from '@/components/dashboard/funnel/pipe';
import { useFunnelData } from '@/hooks/use-funnel-data';
import { toast } from 'sonner';
import { useRequireAuth } from '@/hooks/use-require-auth';

// Enhanced components
import { EnhancedKanbanBoard } from '@/components/dashboard/funnel/enhanced-kanban-board';
import { EnhancedNewOpportunityModal } from '@/components/dashboard/funnel/enhanced-new-opportunity-refactored';
import { OpportunityDetailsModal } from '@/components/dashboard/funnel/opportunity-details-modal';

export default function FunnelPage() {
  useRequireAuth();
  
  // State for modals
  const [showNewOpportunityModal, setShowNewOpportunityModal] = useState<boolean>(false);
  const [showPipeItemModal, setShowPipeItemModal] = useState<boolean>(false);
  const [showCreatePipe, setShowCreatePipe] = useState<boolean>(false);
  const [showConfigColumns, setShowConfigColumns] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [selectedPipeItem, setSelectedPipeItem] = useState<PipeItem | null>(null);

  const {
    columns,
    totalValue,
    isLoading,
    addOpportunity,
    addColumn,
  } = useFunnelData();

  const handleOpenProfile = (item: PipeItem) => {
    setSelectedPipeItem(item);
    setShowPipeItemModal(true);
  };

  const handleNewOpportunity = (opportunityData: Omit<PipeItem, 'id'>) => {
    addOpportunity(opportunityData);
    setShowNewOpportunityModal(false);
    toast.success('Nova oportunidade adicionada!');
  };

  const handleCreatePipe = (pipeData: { title: string }) => {
    addColumn(pipeData);
    setShowCreatePipe(false);
    toast.success('Nova coluna criada!');
  };

  if (isLoading) {
    return (
      <main className="p-6 space-y-6 bg-gray-50 w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="flex gap-4 h-96">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 space-y-6 bg-gray-50 w-full dashboard-main overflow-y-auto">
      {/* Header */}
      <section className="flex items-center justify-between">
        <h1 className="text-title-loomis">Funil de vendas</h1>
        <div className="flex items-center gap-2 rounded-md border bg-[#111B210F] px-4 py-2 text-sm text-gray-700 shadow-xs">
          <span className="text-gray-600">Valor total do funil:</span>
          <strong className="text-gray-900">
            R$ {totalValue.toLocaleString('pt-BR')}
          </strong>
        </div>
      </section>

      {/* Controls */}
      <section className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input placeholder="Pesquisar" className="pl-10 bg-white" />
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="size-4" />
          Filtros
        </Button>
        <Button variant="outline">
          <Share2 className="size-4" />
          Automatizar
        </Button>
        <Button
          className="bg-green-loomis cursor-pointer hover:bg-green-loomis-light hover:text-green-loomis active:scale-90"
          type="button"
          onClick={() => setShowNewOpportunityModal(true)}
        >
          <PlusCircle className="size-4" />
          Nova oportunidade
        </Button>
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Mais opções">
              <EllipsisVertical className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="end">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full hover:bg-transparent active:scale-90 cursor-pointer"
                onClick={() => {
                  setShowPopover(false);
                  setShowConfigColumns(true);
                }}
              >
                <SquarePen /> Configurar colunas
              </Button>
            </div>
            <div className="text-center text-green-loomis">
              <Button
                variant="ghost"
                className="w-full hover:bg-transparent hover:text-green-loomis active:scale-90 cursor-pointer"
                onClick={() => {
                  setShowPopover(false);
                  setShowCreatePipe(true);
                }}
              >
                Adicionar Funil <PlusCircle />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </section>

      {/* Kanban Board */}
      {columns.length === 0 ? (
        <NoOpportunity />
      ) : (
        <EnhancedKanbanBoard openProfilePipe={handleOpenProfile} />
      )}

      {/* Modals */}
      <EnhancedNewOpportunityModal
        onClose={() => setShowNewOpportunityModal(false)}
        show={showNewOpportunityModal}
        onSubmit={handleNewOpportunity}
      />
      
      <OpportunityDetailsModal
        onClose={() => setShowPipeItemModal(false)}
        show={showPipeItemModal}
        item={selectedPipeItem}
      />

      <CreatePipe
        show={showCreatePipe}
        onClose={() => setShowCreatePipe(false)}
        onSubmit={handleCreatePipe}
      />

      <ConfigColumnsDialog
        show={showConfigColumns}
        onClose={() => setShowConfigColumns(false)}
        onSubmit={addColumn}
      />
    </main>
  );
}