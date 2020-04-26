import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryService = new CreateCategoryService();

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('The amount exceeds the balance!', 400);
    }

    const CategoryExists = await categoryService.execute({ category });

    const transaction = transactionRepository.create({
      title,
      value,
      category: CategoryExists,
      type,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
