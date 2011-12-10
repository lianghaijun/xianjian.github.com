//������ȡ����

	var base = 'pal/';		//��ǰĿ¼
	var files = [
		['sss.mkf', 5],			//��������
		['pat.mkf', 9],			//��ɫ��
		['wor16.asc'],			//���
		//['wor16.fon', 0],		//�����ֿ�
		['jianti.fon', 0],		//�����ֿ�
		['word.dat'],			//����

		['fbp.mkf', 72],		//����ͼ

		['map.mkf', 226],		//��ͼ
		['gop.mkf', 226, (location.hostname!='localhost')],		//ͼԪ
		['mgo.mkf', 637],		//��ɫ
		['rgm.mkf', 92],		//ͷ��
		['m.msg', 0],			//�Ի�����

		['data.mkf'],			//������
		['abc.mkf'],			//
		['ball.mkf'],			//��Ʒ��
		//['map.bin.mkf'];
	];


/*  load resource */

	var file_caches = {};		//key -> Uint8Array

	//��ǰ������Ҫ����Դ�ļ�, ��ֹ��������ͬ���첽����
	function ready(callback) {
		console.log('init ready start');

		var queue = Queue.create();

		for(var i = 0; i < files.length; i++) {

			(function(c) {
				var end = files[c][2] ? files[c][1] * 4 : undefined;
				queue.add(function() {
					loadUrl(files[c][0], 0, end, function(byteArray, url) {
						save(url, byteArray);
						queue.remove();
					}, true);
				});
			})(i);
		}

		queue.finish(callback);
	}

	function load(url) {
		var file = file_caches[url];
		if (!file) {
			alert('δ���� ' + url);
			return;
		}
		return file;
	}

	function save(url, byteArray) {
		file_caches[url] = byteArray;
	}



	//ajax load
	function loadUrl(url, start, end, callback) {
		
		document.getElementById('info').innerHTML += '�������� : ' + url + ' ' + (start||'') + ' ' + (end||'') + '<br/>';
		console.log('����������Դ�ļ� : ' + url + ' ');

		if (callback) {
			Lang.ajaxByteArray(url, start, end, function(ret, url) {
				//document.getElementById('info').innerHTML += '������� (' + ret.length + ')';
				console.log('������� ' + url + '(' + ret.length + ')');
				return callback && callback(ret, url);
			});
		} else {
			var ret = Lang.ajaxByteArray(url, start, end);
			//document.getElementById('info').innerHTML += '������� (' + ret.length + ')';
			console.log('������� ' + url + '(' + ret.length + ')');
			return ret;
		}
	}
	
	/**************    load Mkf file  ***********/
	var loadMkfCount = 0;

	//�ɽ���mkf�����ʽ
	function loadMkf(file, index) {
		var data = load(file);
		var start = data.getInt(index * 4);
		var end = data.getInt(index * 4 + 4);
			
		//console.log('read mkf ' + (loadMkfCount++) + ' : ' + file + ' ' + index + ' -> ' + toHex4(start) + ' ' + toHex4(end));

		if (data.length < end) {
			var f = file_caches[file + '_' + index];
			if (!f) {
				f = loadUrl(file, start, end);
				file_caches[file + '_' + index] = f;
			}
			return f;
		}

		if (end-start > 655360) {
			//alert('overflow : ' + file + ' ' + index + ' ' + (end-start));
			return ;
		}

		return data.slice(start, end);		//��������ͼ
	}




