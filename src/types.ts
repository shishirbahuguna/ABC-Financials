export interface IRowData {
  id: number;
  million: string;
  "2021": string;
  "2022": string;
  "2024": string;
  variance?: string;
  "variance-percent"?: string;
  type?: string;
  edit?: boolean;
  isAddable?: boolean;
  isCustom?: boolean;
  comments?: {
    [key: string]: string;
  };
}
