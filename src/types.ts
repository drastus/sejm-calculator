type PastCommiteeId = 'pis' | 'ko' | 'td' | 'lewica' | 'konfederacja'

export type PastSupport = {
	[pastCommitteeId in PastCommiteeId]: number;
}

export type Committee = {
	id: string;
	name: string;
	shortName: string;
	threshold: number;
	pastSupportEquivalence: [PastCommiteeId, number][];
}

export type Constituency = {
	name: string;
	size: number;
	pastSupport: PastSupport;
	support?: number[];
	mandates?: number[];
}
