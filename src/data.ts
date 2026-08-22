import type {
	PastSupport,
	Committee,
	Constituency,
} from './types';
import csvRaw from './wyniki2023.csv';

type CsvRow = {
	votes: number,
	td: number,
	nl: number,
	pis: number,
	konf: number,
	ko: number,
};

function parseWyniki2023(): CsvRow[] {
	const lines = csvRaw.replace(/^\uFEFF/, '').trim().split('\n');
	const headers = lines[0].split(';').map((h) => h.replace(/^"|"$/g, ''));
	return lines.slice(1).map((line) => {
		const cols = line.split(';');
		const get = (name: string) => parseInt(cols[headers.indexOf(name)], 10);
		return {
			votes: get('votes'),
			td: get('td'),
			nl: get('nl'),
			pis: get('pis'),
			konf: get('konf'),
			ko: get('ko'),
		};
	});
}

const wyniki2023 = parseWyniki2023();

const totalVotes = wyniki2023.reduce((sum, row) => sum + row.votes, 0);

const sumCol = (key: keyof Omit<CsvRow, 'votes'>) =>
	wyniki2023.reduce((sum, row) => sum + row[key], 0);

export const pastSupport: PastSupport = {
	pis: sumCol('pis') / totalVotes * 100,
	ko: sumCol('ko') / totalVotes * 100,
	td: sumCol('td') / totalVotes * 100,
	nl: sumCol('nl') / totalVotes * 100,
	konf: sumCol('konf') / totalVotes * 100,
};

const rowPastSupport = (row: CsvRow): PastSupport => ({
	pis: row.pis / row.votes * 100,
	ko: row.ko / row.votes * 100,
	td: row.td / row.votes * 100,
	nl: row.nl / row.votes * 100,
	konf: row.konf / row.votes * 100,
});

export const committees: Committee[] = [
	{
		id: 'ko',
		name: 'Koalicja Obywatelska',
		shortName: 'KO',
		threshold: 8,
		pastSupportEquivalence: [['ko', 1]],
	},
	{
		id: 'konf',
		name: 'Konfederacja',
		shortName: 'Konf.',
		threshold: 5,
		pastSupportEquivalence: [['konf', 1]],
	},
	{
		id: 'korona',
		name: 'Konfederacja Korony Polskiej',
		shortName: 'Korona',
		threshold: 5,
		pastSupportEquivalence: [['ko', 0.07], ['pis', 0.31], ['konf', 0.55], ['td', 0.05], ['nl', 0.02]],
	},
	{
		id: 'nl',
		name: 'Nowa Lewica',
		shortName: 'NL',
		threshold: 5,
		pastSupportEquivalence: [['nl', 1]],
	},
	{
		id: 'razem',
		name: 'Partia Razem',
		shortName: 'Razem',
		threshold: 5,
		pastSupportEquivalence: [['ko', 0.32], ['pis', 0.05], ['konf', 0.03], ['td', 0.19], ['nl', 0.41]],
	},
	{
		id: 'pl2050',
		name: 'Polska 2050',
		shortName: 'PL2050',
		threshold: 5,
		pastSupportEquivalence: [['td', 1]],
	},
	{
		id: 'psl',
		name: 'Polskie Stronnictwo Ludowe',
		shortName: 'PSL',
		threshold: 5,
		pastSupportEquivalence: [['td', 1]],
	},
	{
		id: 'pis',
		name: 'Prawo i Sprawiedliwość',
		shortName: 'PiS',
		threshold: 5,
		pastSupportEquivalence: [['pis', 1]],
	},
	{
		id: 'rplus',
		name: 'Rozwój Plus',
		shortName: 'R+',
		threshold: 5,
		pastSupportEquivalence: [['pis', 1]],
	},
	{
		id: 'mn',
		name: 'Mniejszość Niemiecka',
		shortName: 'MN',
		threshold: 0,
		pastSupportEquivalence: [],
	},
];

export const benchSort = [
	'razem',
	'nl',
	'ko',
	'mn',
	'pl2050',
	'psl',
	'rplus',
	'pis',
	'konf',
	'korona',
];

const constituencyDefs: Array<{name: string, size: number}> = [
	{name: 'Legnica', size: 12},
	{name: 'Wałbrzych', size: 8},
	{name: 'Wrocław', size: 14},
	{name: 'Bydgoszcz', size: 12},
	{name: 'Toruń', size: 13},
	{name: 'Lublin', size: 15},
	{name: 'Chełm', size: 12},
	{name: 'Zielona Góra', size: 12},
	{name: 'Łódź', size: 10},
	{name: 'Piotrków Trybunalski', size: 9},
	{name: 'Sieradz', size: 12},
	{name: 'Chrzanów', size: 8},
	{name: 'Kraków', size: 14},
	{name: 'Nowy Sącz', size: 10},
	{name: 'Tarnów', size: 9},
	{name: 'Płock', size: 10},
	{name: 'Radom', size: 9},
	{name: 'Siedlce', size: 12},
	{name: 'Warszawa I', size: 20},
	{name: 'Warszawa II', size: 12},
	{name: 'Opole', size: 12},
	{name: 'Krosno', size: 11},
	{name: 'Rzeszów', size: 15},
	{name: 'Białystok', size: 14},
	{name: 'Gdańsk', size: 12},
	{name: 'Gdynia', size: 14},
	{name: 'Bielsko-Biała', size: 9},
	{name: 'Częstochowa', size: 7},
	{name: 'Gliwice', size: 9},
	{name: 'Rybnik', size: 9},
	{name: 'Katowice', size: 12},
	{name: 'Sosnowiec', size: 9},
	{name: 'Kielce', size: 16},
	{name: 'Elbląg', size: 8},
	{name: 'Olsztyn', size: 10},
	{name: 'Kalisz', size: 12},
	{name: 'Konin', size: 9},
	{name: 'Piła', size: 9},
	{name: 'Poznań', size: 10},
	{name: 'Koszalin', size: 8},
	{name: 'Szczecin', size: 12},
];

export const constituencies: Constituency[] = constituencyDefs.map((def, i) => ({
	name: def.name,
	size: def.size,
	votes: wyniki2023[i].votes,
	pastSupport: rowPastSupport(wyniki2023[i]),
}));
