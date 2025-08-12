public class Arrays {
    public static void main(String[] args) {
        // 配列の宣言と初期化
        String[] skills = {"Java", "Spring Boot", "SQL", "Git", "Docker"};
        int[] monthlyIncome = {40, 45, 50, 60, 70, 80};  // 月収推移（万円）
        
        // 配列の要素にアクセス
        System.out.println("最初に学ぶスキル: " + skills[0]);
        System.out.println("最終目標スキル: " + skills[skills.length - 1]);
        
        // 配列の長さ
        System.out.println("習得予定スキル数: " + skills.length);
        
        // for文で配列を処理
        System.out.println("\n-- スキル習得計画 --");
        for (int i = 0; i < skills.length; i++) {
            System.out.println((i + 1) + "番目: " + skills[i]);
        }
        
        // 拡張for文（for-each）
        System.out.println("\n-- 月収推移 --");
        int month = 1;
        for (int income : monthlyIncome) {
            System.out.println(month + "ヶ月目: " + income + "万円");
            month++;
        }
        
        // 配列の合計と平均
        int total = 0;
        for (int income : monthlyIncome) {
            total += income;
        }
        double average = (double) total / monthlyIncome.length;
        System.out.println("\n6ヶ月間の合計収入: " + total + "万円");
        System.out.println("平均月収: " + average + "万円");
        
        // 2次元配列（プロジェクト管理）
        String[][] projects = {
            {"ECサイト", "40万", "Java"},
            {"在庫管理", "50万", "Spring Boot"},
            {"API開発", "60万", "REST API"}
        };
        
        System.out.println("\n-- 案件リスト --");
        for (String[] project : projects) {
            System.out.println("案件: " + project[0] + " | 報酬: " + project[1] + " | 技術: " + project[2]);
        }
    }
}