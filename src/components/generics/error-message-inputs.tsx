interface IErrorComponent {
	messageError: string | undefined;
}

export function ErrorMensageComponent({ messageError }: IErrorComponent) {
	return <p className='text-sm text-error-500 p-2'>{messageError}</p>;
}
