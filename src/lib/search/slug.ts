
const RU_MAP: Record<string, string> = {
	а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i',
	к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
	х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ы: 'y', э: 'e', ю: 'yu', я: 'ya',
	ъ: '', ь: ''
};
export function toSlug(input: string): string {
	const s = (input ?? '')
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '');

	let out = '';
	for (const ch of s) {
		if (/[a-z0-9]/.test(ch)) out += ch;
		else if (RU_MAP[ch]) out += RU_MAP[ch];
		else if (/\s|_/.test(ch)) out += '-';
		else if (/[.-]/.test(ch)) out += ch;

	}
	return out
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

export const normalize = (s: string) =>
	(s ?? '')
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/\s+/g, ' ')
		.trim();
