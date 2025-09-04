import { useState, useEffect } from 'react';
import { PipeItem } from '@/components/dashboard/funnel/pipe';

export interface FunnelColumn {
  id: string;
  title: string;
  value: string;
  notify: number;
  colorHead: string;
  items: PipeItem[];
}

const DEFAULT_COLUMNS: FunnelColumn[] = [
  {
    id: 'abordagem',
    title: 'Abordagem',
    value: 'R$ 45.000',
    notify: 3,
    colorHead: '#194E37',
    items: [
      {
        id: '1',
        username: 'João Silva',
        phone: '+55 11 99999-9999',
        amount: 'R$ 15.000',
        message: 'Interessado em nossos serviços de consultoria empresarial',
        tags: ['Novo Lead']
      },
      {
        id: '2',
        username: 'Maria Santos',
        phone: '+55 11 88888-8888',
        amount: 'R$ 30.000',
        message: 'Precisa de uma solução completa para sua empresa',
        tags: ['Qualificado']
      }
    ]
  },
  {
    id: 'qualificacao',
    title: 'Qualificação',
    value: 'R$ 85.000',
    notify: 2,
    colorHead: '#2563eb',
    items: [
      {
        id: '3',
        username: 'Pedro Oliveira',
        phone: '+55 11 77777-7777',
        amount: 'R$ 50.000',
        message: 'Já validou orçamento e tem interesse real',
        tags: ['Orçamento Aprovado']
      },
      {
        id: '4',
        username: 'Ana Costa',
        phone: '+55 11 66666-6666',
        amount: 'R$ 35.000',
        message: 'Aguardando aprovação da diretoria',
        tags: ['Em Análise']
      }
    ]
  },
  {
    id: 'followup',
    title: 'Follow Up',
    value: 'R$ 120.000',
    notify: 4,
    colorHead: '#ea580c',
    items: [
      {
        id: '5',
        username: 'Carlos Mendes',
        phone: '+55 11 55555-5555',
        amount: 'R$ 75.000',
        message: 'Reagendou reunião para próxima semana',
        tags: ['Reunião Marcada']
      },
      {
        id: '6',
        username: 'Lucia Ferreira',
        phone: '+55 11 44444-4444',
        amount: 'R$ 45.000',
        message: 'Solicitou mais informações sobre implementação',
        tags: ['Informações Pendentes']
      }
    ]
  },
  {
    id: 'negociacao',
    title: 'Negociação',
    value: 'R$ 200.000',
    notify: 2,
    colorHead: '#16a34a',
    items: [
      {
        id: '7',
        username: 'Roberto Lima',
        phone: '+55 11 33333-3333',
        amount: 'R$ 120.000',
        message: 'Negociando prazo e condições de pagamento',
        tags: ['Proposta Enviada']
      },
      {
        id: '8',
        username: 'Fernanda Rocha',
        phone: '+55 11 22222-2222',
        amount: 'R$ 80.000',
        message: 'Aguardando assinatura do contrato',
        tags: ['Contrato Pendente']
      }
    ]
  }
];

const STORAGE_KEY = 'loomis-funnel-data';

export function useFunnelData() {
  const [columns, setColumns] = useState<FunnelColumn[]>(DEFAULT_COLUMNS);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setColumns(parsedData);
      }
    } catch (error) {
      console.error('Error loading funnel data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever columns change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
      } catch (error) {
        console.error('Error saving funnel data to localStorage:', error);
      }
    }
  }, [columns, isLoading]);

  // Calculate total funnel value
  const totalValue = columns.reduce((total, column) => {
    const columnTotal = column.items.reduce((sum, item) => {
      const value = parseFloat(item.amount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      return sum + value;
    }, 0);
    return total + columnTotal;
  }, 0);

  // Update column values based on items
  const updateColumnValues = (updatedColumns: FunnelColumn[]) => {
    const columnsWithUpdatedValues = updatedColumns.map(column => {
      const columnTotal = column.items.reduce((sum, item) => {
        const value = parseFloat(item.amount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        return sum + value;
      }, 0);
      return {
        ...column,
        value: `R$ ${columnTotal.toLocaleString('pt-BR')}`,
        notify: column.items.length
      };
    });
    setColumns(columnsWithUpdatedValues);
  };

  // Move item between columns
  const moveItem = (itemId: string, fromColumnId: string, toColumnId: string) => {
    const updatedColumns = columns.map(column => ({ ...column }));
    
    const fromColumn = updatedColumns.find(col => col.id === fromColumnId);
    const toColumn = updatedColumns.find(col => col.id === toColumnId);
    
    if (!fromColumn || !toColumn) return;
    
    const itemIndex = fromColumn.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    const [movedItem] = fromColumn.items.splice(itemIndex, 1);
    toColumn.items.push(movedItem);
    
    updateColumnValues(updatedColumns);
  };

  // Add new opportunity
  const addOpportunity = (opportunity: Omit<PipeItem, 'id'>) => {
    const newOpportunity: PipeItem = {
      ...opportunity,
      id: Date.now().toString()
    };
    
    const updatedColumns = columns.map(column => {
      if (column.id === 'abordagem') {
        return {
          ...column,
          items: [...column.items, newOpportunity]
        };
      }
      return column;
    });
    
    updateColumnValues(updatedColumns);
  };

  // Add new column
  const addColumn = (columnData: { title: string }) => {
    const newColumn: FunnelColumn = {
      id: Date.now().toString(),
      title: columnData.title,
      value: 'R$ 0',
      notify: 0,
      colorHead: '#6b7280',
      items: []
    };
    
    setColumns([...columns, newColumn]);
  };

  // Remove item
  const removeItem = (itemId: string, columnId: string) => {
    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          items: column.items.filter(item => item.id !== itemId)
        };
      }
      return column;
    });
    
    updateColumnValues(updatedColumns);
  };

  return {
    columns,
    totalValue,
    isLoading,
    moveItem,
    addOpportunity,
    addColumn,
    removeItem
  };
}