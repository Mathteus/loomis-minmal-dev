import { EllipsisVertical } from 'lucide-react';
import styles from './pipe.module.css';

export type PipeItem = {
	username: string;
	phone: string;
	amount: string;
	message: string;
	tags: string[];
};

export interface IPipeProps {
	title: string;
	Value: string;
	notify: number;
	colorHead: string;
	items: PipeItem[];
	openProfilePipe: () => void;
}

export function Pipe({
	title,
	Value,
	notify,
	colorHead,
	openProfilePipe,
	items,
}: IPipeProps) {
	return (
		<main
			className={`w-[16vw] overflow-y-scroll h-full bg-[#111B211A] p-4 rounded-lg ${styles.HideScroolBar}`}>
			<section
				className={`bg-[#194E37] text-white p-2 rounded-lg flex justify-between mb-4 items-center`}>
				<div>
					<h1>{title}</h1>
					<span>{Value}</span>
				</div>
				<div className='bg-[#FFFFFF29] flex p-3 rounded-full size-4 justify-center items-center'>
					{notify}
				</div>
			</section>
			<section>
				{items.map((item) => (
					<section
						key={item.username}
						className='bg-white p-4 rounded-lg my-2 flex flex-col gap-2'
						onClick={openProfilePipe}>
						<section className='flex justify-between items-center'>
							<div>
								<div className='text-gray-700 text-medium-loomis'>
									{item.username}
								</div>
								<div className='text-gray-500 text-small-loomis'>
									{item.phone}
								</div>
								<div className='text-gray-500 text-small-loomis'>
									{item.amount}
								</div>
							</div>
							<div>
								<EllipsisVertical />
							</div>
						</section>
						<div className='bg-green-loomis-light text-green-loomis w-max py-1 px-2 my-2 text-details-loomis rounded-2xl'>
							{item.tags[0]}
						</div>
						<div className={styles.cutText}>{item.message}</div>
					</section>
				))}
			</section>
		</main>
	);
}
