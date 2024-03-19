// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type AccountsId } from './Accounts';
import { type ColumnType, type Selectable } from 'kysely';

/** Represents the view public.balances */
export default interface BalancesTable {
  account_id: ColumnType<AccountsId, never, never>;

  balance: ColumnType<string, never, never>;
}

export type Balances = Selectable<BalancesTable>;
