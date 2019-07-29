import { MenuItem } from 'primeng/api';
export class TabMenuModel implements MenuItem {
    tabId: number;
    label: string;
    path?: string;
    icon?: string;
}
