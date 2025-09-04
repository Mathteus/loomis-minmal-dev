import {
	MessageCircle,
	Mic,
	Smile,
	Clock,
	Sun,
	Star,
	Heart,
	Trash,
	Pause,
	Play,
	MoreHorizontal,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonPlusChat, PlusItem } from './button-plus-chat';
import { useFastMessageDialogStore } from '@/contexts/fast-message-dialog';

export interface IAreaInputsProps {
	messageText: string;
	setMessageText: (text: string) => void;
	onSendMessage: () => void;
	onSendAudio: (dataUrl: string) => void;
	onSendFiles?: (
		files: Array<{ name: string; type: string; size: number; dataUrl: string }>,
	) => void;
}

export function AreaInputs({
	messageText,
	setMessageText,
	onSendMessage,
	onSendAudio,
	onSendFiles,
}: IAreaInputsProps) {
	const [isFocus, setIsFocus] = useState<boolean>(false);
	const [showEmoji, setShowEmoji] = useState<boolean>(false);
	const emojiPanelRef = useRef<HTMLDivElement | null>(null);
	const emojiBtnRef = useRef<HTMLButtonElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const fileMediaInputRef = useRef<HTMLInputElement | null>(null);
	const fileDocInputRef = useRef<HTMLInputElement | null>(null);
	const { setModalFastMessage } = useFastMessageDialogStore();

	// Audio recording state
	const [mode, setMode] = useState<'text' | 'record'>('text');
	const [isPaused, setIsPaused] = useState<boolean>(false);
	const [elapsed, setElapsed] = useState<number>(0);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const chunksRef = useRef<BlobPart[]>([]);
	const shouldSendRef = useRef<boolean>(true);
	const stoppedRef = useRef<boolean>(false);
	const finalizedRef = useRef<boolean>(false);

	// Helper type for vendor-specific extensions
	type ExtendedMediaRecorder = MediaRecorder & {
		mimeType?: string;
		requestData?: () => void;
	};

	// After sending, editing or cancelling a message, remember to use
	// `updateMessageHistory(contactId, updatedMessages)` from
	// `@/services/dashboard-services/update-messages` so the localStorage
	// reflects the latest state.

	// scheduled message open handler is managed elsewhere (profile/plus menu)

	// Close emoji popup on outside click
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (!showEmoji) return;
			const target = e.target as Node;
			if (
				target &&
				emojiPanelRef.current &&
				!emojiPanelRef.current.contains(target) &&
				emojiBtnRef.current &&
				!emojiBtnRef.current.contains(target)
			) {
				setShowEmoji(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showEmoji]);

	// Timer for recording
	useEffect(() => {
		if (mode !== 'record' || isPaused) return;
		const id = setInterval(() => setElapsed((s) => s + 1), 1000);
		return () => clearInterval(id);
	}, [mode, isPaused]);

	const formatTime = (s: number) => {
		const mm = Math.floor(s / 60)
			.toString()
			.padStart(1, '0');
		const ss = (s % 60).toString().padStart(2, '0');
		return `${mm}:${ss}`;
	};

	const resetRecordingState = () => {
		mediaRecorderRef.current = null;
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((t) => t.stop());
		}
		mediaStreamRef.current = null;
		chunksRef.current = [];
		stoppedRef.current = false;
		finalizedRef.current = false;
		setElapsed(0);
		setIsPaused(false);
		setMode('text');
	};

	const finalizeFromChunks = (mimeHint?: string) => {
		if (finalizedRef.current) return;
		finalizedRef.current = true;
		try {
			const rec = mediaRecorderRef.current as ExtendedMediaRecorder | null;
			const type = (rec && rec.mimeType) || mimeHint || 'audio/webm';
			const blob = new Blob(chunksRef.current, { type });
			const reader = new FileReader();
			reader.onloadend = () => {
				const dataUrl = typeof reader.result === 'string' ? reader.result : '';
				if (shouldSendRef.current && dataUrl) onSendAudio(dataUrl);
				resetRecordingState();
			};
			reader.readAsDataURL(blob);
		} catch (e) {
			console.error('finalize error:', e);
			resetRecordingState();
		}
	};

	const pickSupportedMimeType = () => {
		const types = [
			'audio/webm;codecs=opus',
			'audio/webm',
			'audio/ogg;codecs=opus',
			'audio/mp4',
			'audio/aac',
		];
		for (const t of types) {
			try {
				if (
					typeof MediaRecorder !== 'undefined' &&
					MediaRecorder.isTypeSupported(t)
				) {
					return t;
				}
			} catch (_err) {
				continue;
			}
		}
		return '';
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaStreamRef.current = stream;
			const mimeType = pickSupportedMimeType();
			const recorder = new MediaRecorder(stream, {
				mimeType: mimeType || undefined,
			});
			chunksRef.current = [];
			stoppedRef.current = false;
			finalizedRef.current = false;
			recorder.ondataavailable = (e) => {
				if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
				// If we've already stopped and are supposed to send, finalize here
				if (
					stoppedRef.current &&
					shouldSendRef.current &&
					chunksRef.current.length > 0
				) {
					finalizeFromChunks(mimeType);
				}
			};
			recorder.onstop = () => {
				try {
					if (!shouldSendRef.current) {
						// reset and bail without sending
						resetRecordingState();
						shouldSendRef.current = true;
						return;
					}
					stoppedRef.current = true;
					if (chunksRef.current.length > 0) {
						finalizeFromChunks(mimeType);
					}
				} catch (e) {
					console.error(e);
					resetRecordingState();
				}
			};
			recorder.onpause = () => setIsPaused(true);
			recorder.onresume = () => setIsPaused(false);
			mediaRecorderRef.current = recorder;
			setMode('record');
			setElapsed(0);
			recorder.start(1000);
		} catch (err) {
			console.error('Audio record error:', err);
			resetRecordingState();
		}
	};

	const stopAndSend = () => {
		const rec = mediaRecorderRef.current as ExtendedMediaRecorder | null;
		if (!rec) return;
		try {
			// flush last buffer to ensure we have data on stop
			if (typeof rec.requestData === 'function') {
				rec.requestData();
			}
		} catch (_e) {
			void 0;
		}
		if (rec.state !== 'inactive') rec.stop();
	};

	const cancelRecording = () => {
		const rec = mediaRecorderRef.current;
		shouldSendRef.current = false;
		if (rec && rec.state !== 'inactive') rec.stop();
		else resetRecordingState();
	};

	const togglePause = () => {
		const rec = mediaRecorderRef.current as ExtendedMediaRecorder | null;
		if (!rec) return;
		try {
			if (rec.state === 'recording') {
				if (typeof rec.pause === 'function') rec.pause();
				else if (mediaStreamRef.current) {
					mediaStreamRef.current
						.getAudioTracks()
						.forEach((t) => (t.enabled = false));
				}
				setIsPaused(true);
			} else if (rec.state === 'paused') {
				if (typeof rec.resume === 'function') rec.resume();
				else if (mediaStreamRef.current) {
					mediaStreamRef.current
						.getAudioTracks()
						.forEach((t) => (t.enabled = true));
				}
				setIsPaused(false);
			}
		} catch (err) {
			console.error('Pause/resume error:', err);
		}
	};

	const emojis =
		'😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🫢 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🫡 🤭 🤫 🤥 😶 😐 😑 😬 🫠 🙄 😮‍💨 😮 😯 😲 🥱 😴 🤤 😪 😵 🤐 🫢 🤒 🤕 🤧 🤮 🤢 🤠 😷 🫨 🤥 🤡 👿 😈'.split(
			' ',
		);

	function readFilesAsDataURL(
		files: FileList | null,
	): Promise<
		Array<{ name: string; type: string; size: number; dataUrl: string }>
	> {
		if (!files || files.length === 0) return Promise.resolve([]);
		const tasks = Array.from(files).map(
			(file) =>
				new Promise<{
					name: string;
					type: string;
					size: number;
					dataUrl: string;
				}>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () =>
						resolve({
							name: file.name,
							type: file.type,
							size: file.size,
							dataUrl: typeof reader.result === 'string' ? reader.result : '',
						});
					reader.onerror = () => {
						const reason = new Error(
							reader.error?.message || 'Falha ao ler arquivo',
						);
						reject(reason);
					};
					reader.readAsDataURL(file);
				}),
		);
		return Promise.all(tasks);
	}

	const handlePlusPick = (item: PlusItem) => {
		if (item === 'Agendar mensagem') return; // handled globally
		if (item === 'Fotos e videos') fileMediaInputRef.current?.click();
		if (item === 'Documento') fileDocInputRef.current?.click();
	};

	const handleSelectMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.currentTarget;
		const list = input.files;
		const files = await readFilesAsDataURL(list);
		if (files.length > 0) onSendFiles?.(files);
		if (fileMediaInputRef.current) fileMediaInputRef.current.value = '';
	};

	const handleSelectDocument = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const input = e.currentTarget;
		const list = input.files;
		const files = await readFilesAsDataURL(list);
		if (files.length > 0) onSendFiles?.(files);
		if (fileDocInputRef.current) fileDocInputRef.current.value = '';
	};

	const handlePickEmoji = (emoji: string) => {
		setMessageText(`${messageText}${emoji}`);
		setShowEmoji(false);
		// Keep focus in the input for continued typing
		requestAnimationFrame(() => inputRef.current?.focus());
	};

	const RecordingBar = () => (
		<section className='relative p-3 border-t border-gray-200 bg-white flex items-center gap-3 w-full h-[72px]'>
			<button
				className='h-10 w-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-400 cursor-pointer active:scale-95'
				onClick={cancelRecording}
				aria-label='Cancelar gravação'>
				<Trash />
			</button>
			<div className='flex items-center gap-2 min-w-[72px]'>
				<span
					className={`inline-block w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500 animate-pulse' : 'bg-red-600'}`}
				/>
				<span
					className={`text-gray-700 font-medium ${isPaused ? 'animate-pulse' : ''}`}>
					{formatTime(elapsed)}
				</span>
			</div>
			<div
				className={`h-10 w-10 rounded-full ${isPaused ? 'bg-yellow-500 animate-pulse' : 'bg-green-loomis'} text-white flex items-center justify-center shadow-sm`}>
				<MoreHorizontal />
			</div>
			<button
				className='h-10 w-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-400 cursor-pointer active:scale-95'
				onClick={togglePause}
				aria-label={isPaused ? 'Retomar gravação' : 'Pausar gravação'}>
				{isPaused ? <Play /> : <Pause />}
			</button>
			<button
				className='ml-auto h-11 px-6 bg-green-loomis text-white active:scale-105 rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
				onClick={stopAndSend}
				disabled={elapsed === 0}>
				Enviar
			</button>
		</section>
	);

	return (
		<section className='relative p-3 border-t border-gray-200 bg-white flex items-center gap-2 w-full h-[72px]'>
			{mode === 'record' ? (
				<RecordingBar />
			) : (
				<>
					<input
						type='file'
						accept='image/*,video/*'
						multiple
						className='hidden'
						ref={(el) => {
							fileMediaInputRef.current = el;
						}}
						onChange={handleSelectMedia}
					/>
					<input
						type='file'
						className='hidden'
						ref={(el) => {
							fileDocInputRef.current = el;
						}}
						onChange={handleSelectDocument}
					/>
					<button
						ref={emojiBtnRef}
						className='p-2 text-green-loomis cursor-pointer active:scale-110'
						onClick={() => setShowEmoji((s) => !s)}
						aria-label='Abrir emojis'>
						<Smile size={25} />
					</button>

					{showEmoji && (
						<div
							ref={emojiPanelRef}
							className='absolute bottom-20 left-4 z-50 w-72 sm:w-80 rounded-xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-gray-200'>
							<div className='px-3 py-2 border-b border-gray-100'>
								<span className='text-sm font-medium text-gray-700'>
									Emojis
								</span>
							</div>
							<div className='max-h-64 overflow-y-auto p-2'>
								<div className='grid grid-cols-8 gap-1 text-xl leading-none select-none'>
									{emojis.map((e, idx) => (
										<button
											key={`${e}-${idx}`}
											className='h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 active:scale-95'
											onClick={() => handlePickEmoji(e)}
											aria-label={`Inserir emoji ${idx + 1}`}>
											{e}
										</button>
									))}
								</div>
							</div>
							<div className='px-2 py-1 border-t border-gray-100 flex items-center justify-between text-gray-500'>
								<div className='flex items-center gap-2 px-1'>
									<Clock size={18} />
									<Heart size={18} />
									<Smile size={18} />
									<Sun size={18} />
									<Star size={18} />
								</div>
								<button
									className='text-xs text-green-loomis px-2 py-1 hover:bg-green-50 rounded'
									onClick={() => setShowEmoji(false)}>
									Fechar
								</button>
							</div>
						</div>
					)}
					<ButtonPlusChat onPick={handlePlusPick} />
					<div
						className={`flex items-center gap-2 flex-1 border-green-loomis rounded-lg px-2 py-1 ${isFocus ? 'border-2' : 'border'}`}>
						<input
							type='text'
							ref={inputRef}
							value={messageText}
							onChange={(e) => setMessageText(e.target.value)}
							onFocus={() => setIsFocus(true)}
							onBlur={() => setIsFocus(false)}
							placeholder='Digite a mensagem'
							className='flex-1 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-0 focus:ring-green-loomis focus:border-transparent'
						/>
						<button
							className='p-2 text-green-loomis cursor-pointer active:scale-110'
							onClick={() => setModalFastMessage(true)}
							aria-label='Abrir mensagens rápidas'>
							<MessageCircle size={25} />
						</button>
						<button
							className='p-2 text-green-loomis cursor-pointer active:scale-110'
							onClick={startRecording}
							aria-label='Gravar áudio'>
							<Mic size={25} />
						</button>
					</div>
					<button
						className='px-6 py-3 bg-green-loomis text-white active:scale-105 rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
						onClick={() => {
							onSendMessage();
						}}
						disabled={messageText.trim() === ''}>
						Enviar
					</button>
				</>
			)}
		</section>
	);
}
