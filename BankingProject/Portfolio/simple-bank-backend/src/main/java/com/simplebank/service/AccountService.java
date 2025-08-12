package com.simplebank.service;

import com.simplebank.entity.Account;
import com.simplebank.entity.Transaction;
import com.simplebank.repository.AccountRepository;
import com.simplebank.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {
    
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    
    public Account createAccount(String accountNumber, String ownerName, String password) {
        if (accountRepository.existsByAccountNumber(accountNumber)) {
            throw new RuntimeException("口座番号が既に存在します");
        }
        
        Account account = new Account();
        account.setAccountNumber(accountNumber);
        account.setOwnerName(ownerName);
        account.setPassword(password);
        account.setBalance(BigDecimal.ZERO);
        
        return accountRepository.save(account);
    }
    
    public Account getAccount(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new RuntimeException("口座が見つかりません"));
    }
    
    @Transactional
    public Transaction deposit(String accountNumber, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("入金額は0円より大きくなければなりません");
        }
        
        Account account = getAccount(accountNumber);
        BigDecimal newBalance = account.getBalance().add(amount);
        account.setBalance(newBalance);
        accountRepository.save(account);
        
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setType(Transaction.TransactionType.DEPOSIT);
        transaction.setAmount(amount);
        transaction.setBalanceAfter(newBalance);
        
        return transactionRepository.save(transaction);
    }
    
    @Transactional
    public Transaction withdraw(String accountNumber, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("出金額は0円より大きくなければなりません");
        }
        
        Account account = getAccount(accountNumber);
        
        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("残高不足です");
        }
        
        BigDecimal newBalance = account.getBalance().subtract(amount);
        account.setBalance(newBalance);
        accountRepository.save(account);
        
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setType(Transaction.TransactionType.WITHDRAW);
        transaction.setAmount(amount);
        transaction.setBalanceAfter(newBalance);
        
        return transactionRepository.save(transaction);
    }
    
    public List<Transaction> getTransactionHistory(String accountNumber) {
        Account account = getAccount(accountNumber);
        return transactionRepository.findByAccountIdOrderByCreatedAtDesc(account.getId());
    }
    
    public boolean authenticate(String accountNumber, String password) {
        Account account = getAccount(accountNumber);
        return account.getPassword().equals(password);
    }
    
    @Transactional
    public Transaction transfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("振込金額は0円より大きくなければなりません");
        }
        
        // 送金元口座
        Account fromAccount = getAccount(fromAccountNumber);
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("残高不足です");
        }
        
        // 送金先口座
        Account toAccount = getAccount(toAccountNumber);
        
        // 送金元から引き落とし
        BigDecimal fromNewBalance = fromAccount.getBalance().subtract(amount);
        fromAccount.setBalance(fromNewBalance);
        accountRepository.save(fromAccount);
        
        // 送金先に入金
        BigDecimal toNewBalance = toAccount.getBalance().add(amount);
        toAccount.setBalance(toNewBalance);
        accountRepository.save(toAccount);
        
        // 送金元の取引記録
        Transaction fromTransaction = new Transaction();
        fromTransaction.setAccount(fromAccount);
        fromTransaction.setType(Transaction.TransactionType.TRANSFER_OUT);
        fromTransaction.setAmount(amount);
        fromTransaction.setBalanceAfter(fromNewBalance);
        fromTransaction.setDescription("振込先: " + toAccount.getOwnerName());
        transactionRepository.save(fromTransaction);
        
        // 送金先の取引記録
        Transaction toTransaction = new Transaction();
        toTransaction.setAccount(toAccount);
        toTransaction.setType(Transaction.TransactionType.TRANSFER_IN);
        toTransaction.setAmount(amount);
        toTransaction.setBalanceAfter(toNewBalance);
        toTransaction.setDescription("振込元: " + fromAccount.getOwnerName());
        transactionRepository.save(toTransaction);
        
        return fromTransaction;
    }
}