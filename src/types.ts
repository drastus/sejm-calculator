type PastCommiteeId = 'pis' | 'po' | 'razem' | 'korwin' | 'psl' | 'zl' | 'k15' | 'nowoczesna'

export type PastSupport = {
	[pastCommitteeId in PastCommiteeId]: number;
}

export type Committee = {
	id: string;
	name: string;
	shortName: string;
	threshold: number;
	pastSupportEquivalence: PastCommiteeId[];
}

export type Constituency = {
	name: string;
	size: number;
	pastSupport: PastSupport;
	support?: number[];
	mandates?: number[];
}
