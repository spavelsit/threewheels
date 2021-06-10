export interface User {
  email: string;
  password: string;
}

export interface Position {
  _id?: string;
  name: string;
  article: string;
  quantity: number;
  cost: number;
  orderCost: number;
  type?: string;
}

export interface Order {
  _id?: string;
  order?: number;
  date?: Date;
  payment: {
    all: number;
    introduced: number;
  };
  done?: boolean;
  sale?: number;
  client?: string;
  list: OrderPosition[];
}

export interface OrderPosition {
  _id?: string;
  itemID: string;
  name: string;
  article?: string;
  quantity: number;
  cost: number;
  orderCost: number;
  workman?: {
    workman: string;
    percent: number;
  };


  // var angular
  amount?: number;
}
