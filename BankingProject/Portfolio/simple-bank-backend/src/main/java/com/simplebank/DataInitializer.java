package com.simplebank;

import com.simplebank.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final AccountService accountService;
    
    @Override
    public void run(String... args) throws Exception {
        // テスト用アカウントを作成
        try {
            accountService.createAccount("1234567890", "山田太郎", "password123");
            accountService.deposit("1234567890", new BigDecimal("100000"));
            
            accountService.createAccount("0987654321", "佐藤花子", "password456");
            accountService.deposit("0987654321", new BigDecimal("50000"));
            
            System.out.println("テストデータを初期化しました");
            System.out.println("口座番号: 1234567890, パスワード: password123");
            System.out.println("口座番号: 0987654321, パスワード: password456");
        } catch (Exception e) {
            System.out.println("データは既に初期化されています");
        }
    }
}