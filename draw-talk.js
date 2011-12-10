

	//��ʾ���ַ�, ��Ҫ��ĳЩ�ı�����
	function fillText(word, x, y) {
		
		canvas.fillStyle = '#ffffff';
		canvas.font = '16px';
		canvas.fillText(word, x, y);

	}

	
	
(function() {	

	Talk = {
		talkUp : showUp,
		talkDown : showDown,
		talkTips : showTips,			//����ɫ����ʾ
		talkMessage : showMessage,		//�б���

		drawTalk : drawTalk,
		clearTalk : clearTalk,
		showTalkWait : showTalkWait
	}
	
	
	var talkContext = document.getElementById('talk').getContext('2d');
	
	
	var tx = 0;
	var ty = 0;
	var rgmId = 0;
	var rgm = null;
	var rgmX = 0;
	var rgmY = 0;
	var who = null;
	var tips = false;
	var message = false;
	var color = null;
	var clear = true;
	var line = 0;			//��0��


	//����һ��λ�����
	function resetTalk() {
		rgm = null;
		who = null;
		xx = 80;
		yy = 8;
		clear = true;
		color = null;
		tips = false;
		message = false;
	}

	//0x3c
	function showUp(pRgmId) {
		tx = 80;
		ty = 8;
		rgmId = pRgmId;
		rgmX = 8;
		rgmY = 8;

		rgm = rgmId && loadRgm(rgmId);
		clear = true;
	}

	function showDown(pRgmId) {
		tx = 5;
		ty = 110;
		rgmId = pRgmId;
		rgmX = 230;
		rgmY = 100;

		rgm = rgmId && loadRgm(rgmId);
		clear = true;
	}

	function showTips() {
		tips = true;
		tx = 55;
		ty = 25;
		color = null;
	}

	function showMessage() {
		message = true;
		tx = 160;
		ty = 50;
		color = null;
	}


	function drawTalk(msgId) {
		if (message) {
			message = false;
			drawMessage(msgId);
			return;
		} else if (tips) {
			tips = false;
			drawTips(msgId);
			return;
		}
		var t = Thread.currentThread;
		t.wait();
		drawTalk0(msgId, function() {
			checkTalk(function() {
				t.notify();
			});
		});

		
	}

	function drawTalk0(msgId, callback) {
		//��ʾ�Ի�, Top,  msgId�Ի�
		var text = loadMsg(msgId);
		if (Lang.endWiths(text, ':')) {
			who = text;
			callback();
			return ;
		}

		var x = tx;
		var y = ty;

		//console.log('msg ' + msgId);


		if (clear) {
			rgm && talkContext.drawImage(rgm, rgmX, rgmY);
			who && showLine(who, x, y);
			clear = false;
			line = 0;
		}

		line++;
		drawLine(text, x + 16, y + line * 16, callback);

	}


	function drawWord(charCode, x, y, color) {
		var img = color ? loadWord(charCode, color) : loadWord(charCode);
		img && talkContext.drawImage(img, x, y);
	}


	function drawLine(text, x, y, callback) {
		texts = calcText(text);
		var i = 0;
		var timer = setInterval(function() {
			var charCode = texts[i].charCode;
			drawWord(charCode, x + i * 16, y, texts[i].color);
			i++;

			if (i >= texts.length) {
				clearInterval(timer);

				callback && callback();
			}
		}, 15);
	}


//' '�������Ŷ��е������Ժ�ɫ��ʾ   1A
//- -: ���Ŷ��е���������ɫ�ı���ʾ 8D
//" "��˫���Ŷ��е������Ի�ɫ��ʾ   2D
//(�����飬����
//)�����飬����
//~n���Ի��Զ��жϣ����밴�ո�nΪ������ʾ��Ϻ󣬵ȴ���ʱ��
//$n��������ʾ�ٶȣ�nԽ����ʾԽ����Ӱ��֮�������������ʾ��ֱ������һ��$n��������Ϸ���ı䣩
	function calcText(text) {
		var r = [];
		for (var i = 0; i < text.length ; i++) {
			var b = text.getByte(i);

			if (b == 34) {			//"
				color = color == 0xFCDC84 ? null : 0xFCDC84;
			} else if (b == 45) {		//-
				color = color == 0xFFFF00 ? null : 0xFFFF00;
			} else if (b == 39) {		//'
					color = color == 0x0000FF ? null : 0x0000FF;
			} else {
				r.push({
					charCode : text.getShort(i++),
					color : color
				});
			}
		}

		return r;
	}

	function showLine(text, x, y, callback) {
		texts = calcText(text);
		for(var i = 0; i < texts.length; i++) {
			drawWord(texts[i].charCode, x + i * 16, y, texts[i].color);
		}
	}

	//0x8E,  һ��ֻ�г�3�в���Ҫ����, ����ʱ��Ҫ��ǰ����, ��������������
	function clearTalk() {
		updateTalk();				
	}

	//�ո�һ��������Ի�, �����¶Ի�, ͬʱ����
	function updateTalk() {
		talkContext.clearRect(0, 0, talkContext.canvas.width, talkContext.canvas.height);
		clear = true;
	}

	function showTalkWait() {
		var msg = '>';						//��ʾ��������
		fillText(msg, 70, 100);
	}


	//����û��Ƿ��Ѿ�ȷ���˶Ի�
	//1. ����ѳ���3��, ����ȷ��,   (������߼���Ҫȷ��, �ǲ���Ҫ����isNextTalk��)
	//2. �����һ��, ��FFFF�Ի�ָ��, �����
	//3. �����һ��, ��0x3C, 0x3D, ���ϲ���ʾ, �²���ʾ, ��ո��, ����, ������նԻ�
	//4. ������ָ��, ����ȷ��, �����
	//5. ����, ������ǳ���3��, ����յ�, ʹ��0x8E����,  ��1F75, �ù���, �����˵: �ٸ������̸, ֮���0x8E
	function checkTalk(callback) {
		if (line > 3) {
			registerBlank(function() {
				updateTalk();
				callback();	
			});
		} else if (Thread.currentThread.isNextTalk()) {
			callback();
		} else if (Thread.currentThread.isNextTalks()) {		//������0x8E00
			registerBlank(function() {
				callback();	
			});
		} else {
			registerBlank(function() {
				resetTalk();
				updateTalk();
				callback();	
			});
		}
	}


	function drawMessage(msgId) {
		var text = loadMsg(msgId);
		var texts = calcText(text);

		var length = texts.length;

		var x = tx - length * 16/2;
		var y = ty;

		drawBack(length, x, y);
		drawLineSync(texts, x, y);
	}
	
	function drawBack(length, x, y) {
		var picLeft = loadPic(45);
		talkContext.drawImage(picLeft, x - 8, y);

		var picMiddle = loadPic(46);

		for(var i = 0; i < length; i++) {
			talkContext.drawImage(picMiddle, x + i * 16, y);
		}

		var picRight = loadPic(47);
		talkContext.drawImage(picRight, x + i * 16, y);
	}

	function drawLineSync(texts, x, y) {
		for(var i = 0; i < texts.length; i++) {
			drawWord(texts[i].charCode, x + i * 16, y + 9, texts[i].color);
		}

		var t = Thread.currentThread;
		t.wait();
		registerBlank(function() {
			resetTalk();
			updateTalk();
			t.notify();
		});

	}

	function drawTips(msgId) {
		var text = loadMsg(msgId);
		var texts = calcText(text);

		var x = tx - length * 16/2;
		var y = ty;

		drawLineSync(texts, x, y);
		
	}

})();



//������һָ��ǰ, ����Ƿ��жԻ�
//����ָ��ִ�к���, ����Ϊ, �Ի����첽��, ˢд��Ի���, ��




