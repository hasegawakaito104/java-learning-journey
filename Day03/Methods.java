public class Methods {
    public static void main(String[] args) {
        // メソッドの呼び出し
        greeting("長谷川さん");
        
        // 戻り値のあるメソッド
        int monthlyIncome = 40;
        int yearlyIncome = calculateYearlyIncome(monthlyIncome);
        System.out.println("月収" + monthlyIncome + "万円 → 年収" + yearlyIncome + "万円");
        
        // 複数の引数を持つメソッド
        int totalProject = calculateProjectIncome(40, 3);
        System.out.println("3ヶ月のプロジェクト総額: " + totalProject + "万円");
        
        // オーバーロード（同じ名前で引数が違うメソッド）
        displayIncome(40);
        displayIncome(40, 12);
        displayIncome("フリーランス", 40);
        
        // 投資計算
        int savings = calculateSavings(40, 15, 6);  // 月収40万、生活費15万、6ヶ月
        System.out.println("\n6ヶ月後のNoera投資可能額: " + savings + "万円");
    }
    
    // 基本的なメソッド
    public static void greeting(String name) {
        System.out.println("こんにちは、" + name + "！");
        System.out.println("Java案件頑張りましょう！\n");
    }
    
    // 戻り値のあるメソッド
    public static int calculateYearlyIncome(int monthly) {
        return monthly * 12;
    }
    
    // 複数の引数
    public static int calculateProjectIncome(int monthly, int months) {
        return monthly * months;
    }
    
    // メソッドのオーバーロード（引数の数が違う）
    public static void displayIncome(int monthly) {
        System.out.println("月収: " + monthly + "万円");
    }
    
    public static void displayIncome(int monthly, int months) {
        System.out.println("月収: " + monthly + "万円 × " + months + "ヶ月 = " + (monthly * months) + "万円");
    }
    
    public static void displayIncome(String jobType, int monthly) {
        System.out.println(jobType + "の月収: " + monthly + "万円");
    }
    
    // Noera事業への投資額計算
    public static int calculateSavings(int income, int expenses, int months) {
        int monthlySavings = income - expenses;
        int totalSavings = monthlySavings * months;
        System.out.println("月間貯金額: " + monthlySavings + "万円");
        return totalSavings;
    }
}