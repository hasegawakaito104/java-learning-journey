public class Variables {
    public static void main(String[] args) {
        // 基本的な変数宣言
        int age = 23;
        String name= "長谷川さん";
        boolean isStudying = true;
        double price = 39.99;
        
        // 値の表示
        System.out.println("名前: " + name);
        System.out.println("年齢: " + age);
        System.out.println("勉強中: " + isStudying);
        System.out.println("価格: " + price);
        
        // 計算
        int months = 3;
        int income = 40;  // 万円
        int totalIncome = months * income;
        
        System.out.println("\n=== 案件計算 ===");
        System.out.println("期間: " + months + "ヶ月");
        System.out.println("月収: " + income + "万円");
        System.out.println("総収入: " + totalIncome + "万円");
        
        // 条件判定
        if (totalIncome >= 100) {
            System.out.println("目標達成！事業投資に回せます");
        } else {
            System.out.println("もう少し頑張りましょう");
        }
    }
}