export interface WixDataItem {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
}

export interface WixDataQueryResult<T extends WixDataItem = WixDataItem> {
  items: T[];
  totalCount: number;
}
