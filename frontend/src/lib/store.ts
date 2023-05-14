import { create } from "zustand";
// import { ethers } from "ethers";
import { ReactNode } from "react";
import { v4 as uuidv4 } from 'uuid';

interface IBucket {
	name: string,
	id: string
}
interface IGroup {
	name: string,
	key: string,
	description: string,
	children?: [] | IGroup[],
	type: string
}

interface AppState {
	buckets: IBucket [] | [],
	setBuckets: (bucket: IBucket) => void,
	groups: IGroup [] | [],
	setGroups: (group: IGroup) => void
	comModalOpen: boolean;
	setComModalOpen: (comModalOpen: boolean) => void;
	groupModalOpen: boolean;
	setGroupModalOpen: (groupModalOpen: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
	buckets: [],
	setBuckets: (bucket: IBucket) => set(({ buckets }) => ({ buckets: [...buckets, bucket]})),
	groups: [
    { key: '81', name: 'knexus', id: '81', description: '', type: 'bucket',
      children: [
        { name: 'prompts.txt', key: '290', id: '290', groupId: '81', description: '', type: 'data' },
        { name: 'kol_lens_follower_quality_report.numbers', key: '295', id: '295', groupId: '81', description: '', type: 'data' },
      ]
    },
  ],
	setGroups: (group: IGroup) => set(({ groups }) => ({ groups: [...groups, group]})),
	comModalOpen: false,
	setComModalOpen: (comModalOpen: boolean) => set({ comModalOpen }),
	groupModalOpen: false,
	setGroupModalOpen: (groupModalOpen: boolean) => set({ groupModalOpen })
}));
