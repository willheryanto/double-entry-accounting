import { db, DB } from "./database";
import { AccountsId } from "./models/public/Accounts";

const MAINCASH = "88d37c51-9398-48b5-8ef9-c26beabde290" as AccountsId;

const deposit = async (db: DB, id: AccountsId, amount: number) => {
  await db.transaction().execute(async (trx) => {
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
    const [balance] = await trx
      .selectFrom("balances")
      .where((eb) =>
        eb.and([
          eb("balance", ">=", amount.toString()),
          eb("account_id", "=", id),
        ]),
      )
      .select("balance")
      .execute();

    if (!balance) throw Error("No balance found");

    const [res] = await trx
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
      .execute();

    if (res.numInsertedOrUpdatedRows && res.numInsertedOrUpdatedRows !== 2n) {
      throw Error("Failed to withdraw");
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

  await deposit(db, account.id, AMOUNT);

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
