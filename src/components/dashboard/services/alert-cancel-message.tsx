import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';

export interface IAlertCancelMessageProps {
	onConfirm?: () => void;
	children: React.ReactNode;
}

export function AlertCancelMessage({
	children,
	onConfirm,
}: IAlertCancelMessageProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Deseja cancelar esse envio?</AlertDialogTitle>
					<AlertDialogDescription>
						Ao cancelar o envio da mensagem, a ação não poderá ser desfeita.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						className={buttonVariants({ variant: 'destructive' })}
						onClick={onConfirm}>
						Sim, cancelar envio
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
