import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const sumIncomes = transactions.reduce((acc, cur) => {
      return cur.type === 'income' ? acc + Number(cur.value) : acc;
    }, 0);

    const sumOutcomes = transactions.reduce((acc, cur) => {
      return cur.type === 'outcome' ? acc + Number(cur.value) : acc;
    }, 0);

    const balance = {
      income: sumIncomes,
      outcome: sumOutcomes,
      total: sumIncomes - sumOutcomes,
    };

    return balance;
  }
}

export default TransactionsRepository;
