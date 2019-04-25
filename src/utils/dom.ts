import { sleep } from './common';

export const toggleVisibility = async (el: HTMLElement, visible: boolean) => {
	const addClass = visible ? 'visible' : 'hidden';
	const removeClass = visible ? 'hidden' : 'visible';
	el.classList.add(addClass);
	el.classList.remove(removeClass);
	await sleep(300);
};
