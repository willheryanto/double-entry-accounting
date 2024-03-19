import { db, DB } from "./database";
import { AccountsId } from "./models/public/Accounts";
import { sql } from "kysely";

const MAINCASH = "88d37c51-9398-48b5-8ef9-c26beabde290" as AccountsId;

const deposit = async (db: DB, id: AccountsId, amount: number) => {
  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable("accounts")
      .set((eb) => ({
        balance: eb("balance", "+", amount.toString()),
      }))
      .where("id", "=", id)
      .returning("balance")
      .executeTakeFirstOrThrow();

    await trx
      .updateTable("accounts")
      .set((eb) => ({
        balance: eb("balance", "-", amount.toString()),
      }))
      .where("id", "=", MAINCASH)
      .returning("balance")
      .executeTakeFirstOrThrow();

    await trx
      .insertInto("journals")
      .values([
        {
          account_id: MAINCASH,
          amount: (amount * -1).toString(),
        },
        {
          account_id: id,
          amount: amount.toString(),
        },
      ])
      .execute();
  });
};

const withdrawal = async (db: DB, id: AccountsId, amount: number) => {
  await db.transaction().execute(async (trx) => {
    try {
      const account = await trx
        .updateTable("accounts")
        .set((eb) => ({
          balance: eb("balance", "-", amount.toString()),
        }))
        .where("id", "=", id)
        .returning("balance")
        .executeTakeFirstOrThrow();

      if (parseInt(account.balance) < 0) throw Error("INSUFFICIENT_BALANCE");

      await trx
        .updateTable("accounts")
        .set((eb) => ({
          balance: eb("balance", "+", amount.toString()),
        }))
        .where("id", "=", MAINCASH)
        .returning("balance")
        .executeTakeFirstOrThrow();

      const res = await trx
        .insertInto("journals")
        .values([
          {
            account_id: id,
            amount: (amount * -1).toString(),
          },
          {
            account_id: MAINCASH,
            amount: amount.toString(),
          },
        ])
        .executeTakeFirst();

      if (res.numInsertedOrUpdatedRows && res.numInsertedOrUpdatedRows !== 2n) {
        throw Error("Failed to withdraw");
      }
    } catch (e) {
      // console.log(e);
      throw e;
    }
  });
};

(async () => {
  const [account] = await db
    .selectFrom("accounts")
    .where("name", "=", "WILL")
    .select("id")
    .execute();

  const AMOUNT = 100;

  await deposit(db, account.id, AMOUNT * 3);

  try {
    await Promise.allSettled(
      Array(1000)
        .fill(null)
        .map(async () => {
          await withdrawal(db, account.id, AMOUNT);
        }),
    );
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
