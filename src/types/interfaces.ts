export interface IBaseModel {
  id: string;
  createdAt: number;
  deleted: boolean;
}

export type PrecisionType = "LONG" | "SHORT" | "MEDIUM";
export type Status = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface IKeyValue {
  label: string;
  value: string;
}

export type ComponentType = "input" | "select";

export interface IMetadataBase {
  component: ComponentType;
  key: string;
  label: string;
  required?: boolean;
}

export interface IInputMetadata extends IMetadataBase {
  component: "input";
  type: "text" | "number" | "date" | "email" | "password";
  readOnly?: boolean;
}

export interface ISelectOption {
  label: string;
  value: string;
}
export interface ISelectMetadata extends IMetadataBase {
  component: "select";
  mode: "options" | "query";
  multiple?: boolean;
  options?: ISelectOption[];
  query?: string; // endpoint/key to fetch options
}

export type IMetadataField = IInputMetadata | ISelectMetadata;

export interface ISubCategory {
  label: string;
  config: IMetadataField[];
}

export interface ITagCategory extends IBaseModel {
  gameId?: string;
  name: string;
  group: IKeyValue;
  isParentTag?: boolean;
  isReplay?: boolean;
  metadataConfig: IMetadataField[];
  nameStructure: string[];
  precisionType: PrecisionType;
  status: Status;
  subCategories?: Record<string, ISubCategory>;
}
