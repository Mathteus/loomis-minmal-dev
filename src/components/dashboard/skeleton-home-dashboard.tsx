import { Skeleton } from '../ui/skeleton';

export function SkeletonHomeDashboard() {
	return (
		<main className='p-6 space-y-6 bg-gray-50 w-full'>
			<Skeleton className='h-8 w-[20%] bg-gray-300' />
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
				<Skeleton className='h-28 w-full bg-gray-300' />
				<Skeleton className='h-28 w-full bg-gray-300' />
				<Skeleton className='h-28 w-full bg-gray-300' />
				<Skeleton className='h-28 w-full bg-gray-300' />
			</div>
			<hr />
			<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
				<div className='lg:col-span-3 h-[150%]'>
					<Skeleton className='h-[35vh] w-full bg-gray-300' />
				</div>
				<div className='lg:col-span-1 space-y-4'>
					<Skeleton className='h-[10vh] w-full bg-gray-300' />
					<Skeleton className='h-[10vh] w-full bg-gray-300' />
					<Skeleton className='h-[10vh] w-full bg-gray-300' />
				</div>
			</div>
			<hr />
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2'>
					<h3 className='mb-4'>
						<Skeleton className='h-6 w-[250px] bg-gray-300' />
					</h3>
					<div className='flex justify-between w-full gap-8'>
						<Skeleton className='h-[26vh] min-w-full bg-gray-300' />
						<Skeleton className='h-[26vh] min-w-[48%] bg-gray-300' />
					</div>
				</div>
			</div>
		</main>
	);
}
