/*
Export_TextOtSelectionFramejsx
選択しているテキストフレームのテキストを、指定のテキストファイルに追記する
InDesign CS6を推奨：InDesign CS6以前では選択した順にならない。

使い方として、ショートカットを割り当てて、選択→ショートカット実行にするとよい。
my_separatorが空文字列のものを別名で用意して使い分けるとなおよい。


History:
2013-07-10	var.0.1	おうち使い用
2013-09-09	オーバーフローしているテキストフレームに対応

ToDo:
連結しているかどうかの判定→判定して、どうするか？

*/

#target "InDesign"
////////////////////////////////////////////設定
var my_output_file = "~/Desktop/tmp_output.txt";//書き出すテキストファイルパス
var my_separator = "\r\r";//複数のテキストフレームを選択している時、テキストフレーム毎に挟むもの



////////////////////////////////////////////エラー終了
function my_error(mess) {
	if (mess !== "") {alert (mess)}
	exit();
}


////////////////////////////////////////////データをファイルに追記型で書き込む 。書き込んだファイルオブジェクトを返す
function write_file(my_write_file_path, my_data) {
	var my_file_obj = new File(my_write_file_path);
	my_file_obj.encoding = "UTF-8";//★この行がないとShift-JISで書き出される
	//if (!(my_file_obj.exists)) {my_error("ファイルがありません\n" + my_write_file_path)};
	if(my_file_obj.open("a")) {
		my_file_obj.write(my_data);
		my_file_obj.close();
		return my_file_obj;
	} else {
		my_error("ファイルが開けません\n" + my_write_file_path);
	}
}




////////////////////////////////////////////実行
//選択しているもののチェック
if (app.documents.length === 0) {my_error("ドキュメントが開かれていません");};
var my_doc = app.documents[0];
if(my_doc.selection.length === 0){my_error("テキストフレームを選択してください")};
var my_sel = my_doc.selection;
var my_tmp = "";//出力データ
//InDesign CS5まではindex順、CS6からは選択順になった
for (var i =0; i < my_sel.length; i++) {
    if((my_sel[i] instanceof TextFrame) !== true) {my_error("テキストフレームを選択してください")};
    my_tmp += my_sel[i].parentStory.contents + my_separator;
}

write_file(my_output_file, my_tmp + "\r");//書き込み（最後は必ず改行）
my_error(my_tmp + "\r-----------------------------------")//書き込みが成功した確認のためのダイアログ
