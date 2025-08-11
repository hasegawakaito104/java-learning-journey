import java.util.Scanner;

public class MyName {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("================================");
        System.out.println("   🎮 GPD WIN MINI 冒険の始まり 🎮");
        System.out.println("================================");
        
        System.out.print("あなたの名前を入力してください: ");
        String name = scanner.nextLine();
        
        System.out.print("好きな数字を入力してください: ");
        int number = scanner.nextInt();
        
        System.out.println("\n--- 結果 ---");
        System.out.println("こんにちは、" + name + "さん！");
        System.out.println("あなたのラッキーナンバーは " + number + " です！");
        System.out.println("今日から" + number + "日間、毎日Javaを学習しましょう！");
        
        if (number > 30) {
            System.out.println("すごい意欲ですね！きっとマスターできます！");
        } else if (number > 7) {
            System.out.println("いいペースです！継続は力なり！");
        } else {
            System.out.println("まずは1週間、頑張りましょう！");
        }
        
        scanner.close();
    }
}