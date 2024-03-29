// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type default as SchemaMigrationsTable } from './SchemaMigrations';
import { type default as AccountsTable } from './Accounts';
import { type default as JournalsTable } from './Journals';
import { type default as BalancesTable } from './Balances';

export default interface PublicSchema {
  schema_migrations: SchemaMigrationsTable;

  accounts: AccountsTable;

  journals: JournalsTable;

  balances: BalancesTable;
}
