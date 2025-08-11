public class ControlFlow {
    public static void main(String[] args) {
        // if文の基本
        int salary = 40;  // 万円
        
        if (salary >= 100) {
            System.out.println("年収1200万円超え！");
        } else if (salary >= 40) {
            System.out.println("目標達成！案件開始できます");
        } else {
            System.out.println("もう少し学習が必要");
        }
        
        // forループ
        System.out.println("\n月収推移:");
        for (int month = 1; month <= 3; month++) {
            System.out.println(month + "ヶ月目: " + (salary * month) + "万円");
        }
        
        // while文
        int totalIncome = 0;
        int monthCount = 0;
        System.out.println("\n1000万円到達まで:");
        while (totalIncome < 1000) {
            monthCount++;
            totalIncome += salary;
            if (monthCount % 6 == 0) {
                salary += 20;  // 半年ごとに昇給
                System.out.println(monthCount + "ヶ月目: 昇給! 月収" + salary + "万円");
            }
        }
        System.out.println(monthCount + "ヶ月で1000万円達成！");
    }
}