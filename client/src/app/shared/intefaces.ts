export interface User {
  email: string;
  password: string;
}

export interface Order {
  _id?: string;
  order?: number;
  date?: Date;
  sale?: number;
  mechanic?: string;
  percent?: number;
  list?: OrderPosition[];

  // Angular variable
  temporarily?: number;
  select?: string;
  item?: OrderPosition;
}

export interface OrderPosition {
  _id?: string;
  name: string;
  article?: string;
  cost: number;
  orderCost?: number;
  type: string;
  quantity: number;
  amout?: number;
  itemID?: string;
}

export interface Position {
  _id?: string;
  name?: string;
  article?: string;
  quantity?: number;
  cost?: number;
  orderCost?: number;
  type?: string;

  // Angular variable
  genQuantity?: number;
  selQuantity?: number;
  openItem?: boolean;
}

export interface Print {
  type: string;
  item: Order;
}
