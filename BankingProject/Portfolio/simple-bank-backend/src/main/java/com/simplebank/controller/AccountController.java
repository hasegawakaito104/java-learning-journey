package com.simplebank.controller;

import com.simplebank.entity.Account;
import com.simplebank.entity.Transaction;
import com.simplebank.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {
    
    private final AccountService accountService;
    
    @PostMapping("/create")
    public ResponseEntity<AccountResponse> createAccount(@RequestBody CreateAccountRequest request) {
        Account account = accountService.createAccount(
            request.getAccountNumber(),
            request.getOwnerName(),
            request.getPassword()
        );
        return ResponseEntity.ok(new AccountResponse(account));
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        boolean authenticated = accountService.authenticate(
            request.getAccountNumber(),
            request.getPassword()
        );
        
        if (authenticated) {
            Account account = accountService.getAccount(request.getAccountNumber());
            return ResponseEntity.ok(new LoginResponse(true, new AccountResponse(account)));
        } else {
            return ResponseEntity.ok(new LoginResponse(false, null));
        }
    }
    
    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable String accountNumber) {
        Account account = accountService.getAccount(accountNumber);
        return ResponseEntity.ok(new AccountResponse(account));
    }
    
    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(@RequestBody TransactionRequest request) {
        Transaction transaction = accountService.deposit(
            request.getAccountNumber(),
            request.getAmount()
        );
        return ResponseEntity.ok(new TransactionResponse(transaction));
    }
    
    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(@RequestBody TransactionRequest request) {
        Transaction transaction = accountService.withdraw(
            request.getAccountNumber(),
            request.getAmount()
        );
        return ResponseEntity.ok(new TransactionResponse(transaction));
    }
    
    @GetMapping("/{accountNumber}/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactionHistory(@PathVariable String accountNumber) {
        List<Transaction> transactions = accountService.getTransactionHistory(accountNumber);
        List<TransactionResponse> responses = transactions.stream()
            .map(TransactionResponse::new)
            .toList();
        return ResponseEntity.ok(responses);
    }
    
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(@RequestBody TransferRequest request) {
        Transaction transaction = accountService.transfer(
            request.getFromAccountNumber(),
            request.getToAccountNumber(),
            request.getAmount()
        );
        return ResponseEntity.ok(new TransactionResponse(transaction));
    }
}

@Data
class CreateAccountRequest {
    private String accountNumber;
    private String ownerName;
    private String password;
}

@Data
class LoginRequest {
    private String accountNumber;
    private String password;
}

@Data
class LoginResponse {
    private boolean success;
    private AccountResponse account;
    
    public LoginResponse(boolean success, AccountResponse account) {
        this.success = success;
        this.account = account;
    }
}

@Data
class TransactionRequest {
    private String accountNumber;
    private BigDecimal amount;
}

@Data
class TransferRequest {
    private String fromAccountNumber;
    private String toAccountNumber;
    private BigDecimal amount;
}

@Data
class AccountResponse {
    private Long id;
    private String accountNumber;
    private String ownerName;
    private BigDecimal balance;
    
    public AccountResponse(Account account) {
        this.id = account.getId();
        this.accountNumber = account.getAccountNumber();
        this.ownerName = account.getOwnerName();
        this.balance = account.getBalance();
    }
}

@Data
class TransactionResponse {
    private Long id;
    private String type;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String createdAt;
    private String description;
    
    public TransactionResponse(Transaction transaction) {
        this.id = transaction.getId();
        this.type = transaction.getType().toString();
        this.amount = transaction.getAmount();
        this.balanceAfter = transaction.getBalanceAfter();
        this.createdAt = transaction.getCreatedAt().toString();
        this.description = transaction.getDescription();
    }
}