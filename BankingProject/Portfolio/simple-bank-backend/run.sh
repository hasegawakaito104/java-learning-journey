#!/bin/bash
echo "=== Simple Bank Backend 起動中 ==="

# 必要なjarファイルをダウンロード（初回のみ）
LIBS_DIR="libs"
if [ ! -d "$LIBS_DIR" ]; then
    echo "Spring Boot用のJARファイルを準備しています..."
    mkdir -p $LIBS_DIR
    
    # Spring Boot CLIをダウンロード
    echo "Spring Boot CLIが必要です。"
    echo "以下のコマンドでMavenをインストールしてください："
    echo "sudo apt update && sudo apt install maven"
    echo ""
    echo "その後、以下のコマンドで実行してください："
    echo "mvn spring-boot:run"
    exit 1
fi