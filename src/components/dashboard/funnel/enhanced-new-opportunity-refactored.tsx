import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchCollaborators } from '@/services/dashboard/funnel/collaborators';
import { getContacts } from '@/services/dashboard/chat/contacts';
import { PipeItem } from '@/components/dashboard/funnel/pipe';

interface NewOpportunityModalProps {
	onClose: () => void;
	show: boolean;
	onSubmit?: (data: Omit<PipeItem, 'id'>) => void;
}

interface FormData {
	username: string;
	collaborator: string;
	amount: string;
	tags: string[];
	phone: string;
	message: string;
}

const INITIAL_FORM_DATA: FormData = {
	username: '',
	collaborator: '',
	amount: '',
	tags: [],
	phone: '',
	message: ''
};

export default function EnhancedNewOpportunityModal({
	onClose,
	show,
	onSubmit,
}: NewOpportunityModalProps) {
	const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
	const [collaborators, setCollaborators] = useState<any[]>([]);
	const [rawAmount, setRawAmount] = useState('');
	const [tagInput, setTagInput] = useState('');

	// Fetch contacts
	const { data: contacts = [], isLoading: contactsLoading } = useQuery({
		queryKey: ['contacts'],
		queryFn: getContacts,
		enabled: show,
	});

	// Fetch collaborators
	const { data: collaboratorsData = [], isLoading: collaboratorsLoading } = useQuery({
		queryKey: ['collaborators'],
		queryFn: fetchCollaborators,
		enabled: show,
	});
	
	// Update collaborators when data changes
	React.useEffect(() => {
		if (collaboratorsData) {
			setCollaborators(collaboratorsData);
		}
	}, [collaboratorsData]);

	// Format currency
	const formatCurrency = useCallback((value: string): string => {
		const numericValue = value.replace(/\D/g, '');
		if (!numericValue) return '';
		
		const number = parseFloat(numericValue) / 100;
		return number.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		});
	}, []);

	// Handle amount change
	const handleAmountChange = useCallback((value: string) => {
		const numericValue = value.replace(/\D/g, '');
		setRawAmount(numericValue);
		setFormData(prev => ({
			...prev,
			amount: formatCurrency(numericValue)
		}));
	}, [formatCurrency]);

	// Handle tag addition
	const handleAddTag = useCallback(() => {
		if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
			setFormData(prev => ({
				...prev,
				tags: [...prev.tags, tagInput.trim()]
			}));
			setTagInput('');
		}
	}, [tagInput, formData.tags]);

	// Handle tag removal
	const handleRemoveTag = useCallback((tagToRemove: string) => {
		setFormData(prev => ({
			...prev,
			tags: prev.tags.filter(tag => tag !== tagToRemove)
		}));
	}, []);

	// Handle key press for tags
	const handleTagKeyPress = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddTag();
		}
	}, [handleAddTag]);

	// Handle submit
	const handleSubmit = useCallback(() => {
		if (!formData.username || !formData.collaborator || !rawAmount) {
			return;
		}

		const selectedContact = contacts.find(contact => contact.name === formData.username);
		
		const opportunityData: Omit<PipeItem, 'id'> = {
			username: formData.username,
			phone: selectedContact?.phone || formData.phone,
			amount: formData.amount,
			message: formData.message || 'Nova oportunidade criada',
			tags: formData.tags
		};

		onSubmit?.(opportunityData);
		
		// Reset form
		setFormData(INITIAL_FORM_DATA);
		setRawAmount('');
		setTagInput('');
		onClose();
	}, [formData, rawAmount, contacts, onSubmit, onClose]);

	// Check if form is valid
	const isFormValid = useMemo(() => {
		return formData.username && formData.collaborator && rawAmount;
	}, [formData.username, formData.collaborator, rawAmount]);

	// Handle dialog close
	const handleClose = useCallback(() => {
		setFormData(INITIAL_FORM_DATA);
		setRawAmount('');
		setTagInput('');
		onClose();
	}, [onClose]);

	if (!show) return null;

	const isLoading = contactsLoading || collaboratorsLoading;

	return (
		<Dialog open={show} onOpenChange={handleClose}>
			<DialogContent className="max-w-md mx-auto p-0 rounded-2xl overflow-hidden shadow-xl">
				<DialogHeader className="px-6 py-4 border-b bg-white">
					<DialogTitle className="text-lg font-semibold text-gray-800">
						Nova oportunidade
					</DialogTitle>
				</DialogHeader>

				<div className="px-6 py-4 space-y-4 bg-white max-h-[70vh] overflow-y-auto">
					{isLoading ? (
						<div className="space-y-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-10 w-full" />
								</div>
							))}
						</div>
					) : (
						<>
							{/* Customer Selection */}
							<div className="space-y-2">
								<Label className="text-sm font-medium text-gray-700">
									Cliente
								</Label>
								<Select
									value={formData.username}
									onValueChange={(value) =>
										setFormData(prev => ({ ...prev, username: value }))
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecione o cliente" />
									</SelectTrigger>
									<SelectContent>
										{contacts.map((contact: any) => (
											<SelectItem key={contact.id} value={contact.name}>
												<div className="flex items-center space-x-2">
													<div className="flex flex-col">
														<span className="font-medium">{contact.name}</span>
														<span className="text-xs text-gray-500">
															{contact.phone}
														</span>
													</div>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Collaborator Selection */}
							<div className="space-y-2">
								<Label className="text-sm font-medium text-gray-700">
									Colaborador
								</Label>
								<Select
									value={formData.collaborator}
									onValueChange={(value) =>
										setFormData(prev => ({ ...prev, collaborator: value }))
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecione o colaborador" />
									</SelectTrigger>
									<SelectContent>
										{collaborators.map((collab: any) => (
											<SelectItem key={collab.id} value={collab.name}>
												{collab.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Amount Input */}
							<div className="space-y-2">
								<Label className="text-sm font-medium text-gray-700">
									Valor
								</Label>
								<Input
									type="text"
									placeholder="R$ 0,00"
									value={formData.amount}
									onChange={(e) => handleAmountChange(e.target.value)}
									className="w-full"
								/>
							</div>

							{/* Tags Input */}
							<div className="space-y-2">
								<Label className="text-sm font-medium text-gray-700">
									Tags
								</Label>
								<div className="flex flex-wrap gap-1 mb-2">
									{formData.tags.map((tag) => (
										<Badge
											key={tag}
											variant="secondary"
											className="flex items-center gap-1"
										>
											{tag}
											<button
												type="button"
												onClick={() => handleRemoveTag(tag)}
												className="text-gray-500 hover:text-red-500"
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									))}
								</div>
								<div className="flex gap-2">
									<Input
										type="text"
										placeholder="Digite uma tag"
										value={tagInput}
										onChange={(e) => setTagInput(e.target.value)}
										onKeyPress={handleTagKeyPress}
										className="flex-1"
									/>
									<Button
										type="button"
										variant="outline"
										onClick={handleAddTag}
										disabled={!tagInput.trim()}
									>
										Adicionar
									</Button>
								</div>
							</div>

							{/* Message Input */}
							<div className="space-y-2">
								<Label className="text-sm font-medium text-gray-700">
									Mensagem (opcional)
								</Label>
								<Input
									type="text"
									placeholder="Descrição da oportunidade..."
									value={formData.message}
									onChange={(e) =>
										setFormData(prev => ({ ...prev, message: e.target.value }))
									}
									className="w-full"
								/>
							</div>
						</>
					)}
				</div>

				<DialogFooter className="flex justify-between items-center px-6 py-4 border-t bg-white">
					<Button
						variant="ghost"
						onClick={handleClose}
						className="border border-green-600 text-green-600 hover:bg-green-50"
					>
						Cancelar
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!isFormValid || isLoading}
						className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
					>
						Adicionar oportunidade
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}