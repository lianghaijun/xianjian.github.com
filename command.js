		

	talkUp = Talk.talkUp;
	talkDown = Talk.talkDown;
	talkTips = Talk.talkTips;
	talkMessage = Talk.talkMessage;		//alert
	clearTalk = Talk.clearTalk;



	var scriptCodes = [];
	scriptCodes[0x00] =	{func:finishCode, desc:'ָֹͣ��'};
	scriptCodes[0x01] =	{func:stopCode, desc:'ָֹͣ��, �������õ�ַ,��Ϊ��һ��ָ��'};
	scriptCodes[0x02] =	{func:changeScript, desc:'�ж�, ��дָ��'};
	scriptCodes[0x03] =	{func:gotoScript, desc:'call gotoScript'};
	scriptCodes[0x04] =	{func:subScript, desc:'call subScript'};
	scriptCodes[0x05] =	{func:updateScreen, desc:'��Ļ�ػ�'};
	scriptCodes[0x06] =	{func:randomScript, desc:'���ʼ���, �������'};

	scriptCodes[0x0B] =	{func:setSouthDir, desc:'�����������ϱ�'};
	scriptCodes[0x0C] =	{func:setWestDir, desc:'��������������'};
	scriptCodes[0x0D] =	{func:setNorthDir, desc:'���������򱱱�'};
	scriptCodes[0x0E] =	{func:setEastDir, desc:'���������򶫱�'};
	scriptCodes[0x0F] =	{func:setNpcDir, desc:'����Npc����'};

	scriptCodes[0x43] =	{func:setMusic, desc:'��������'};
	scriptCodes[0x45] =	{func:setFightMusic, desc:'����ս������'};
	scriptCodes[0x47] =	{func:null, desc:'������Ч'};
	scriptCodes[0x46] =	{func:setRolePos, desc:'���ö�Ա��λ��'};
	scriptCodes[0x65] =	{func:setRoleTile, desc:'���ö�Ա����'};
	scriptCodes[0x15] =	{func:setRoleIndex, desc:'���ö�Ա����/֡'};
	scriptCodes[0x75] =	{func:setRoleGroup, desc:'�������'};
	scriptCodes[0x3B] =	{func:talkTips, desc:'��ʾtips'};
	scriptCodes[0x3C] =	{func:talkUp, desc:'�ϲ���ʾ'};
	scriptCodes[0x3D] =	{func:talkDown, desc:'�²���ʾ'};
	scriptCodes[0x3E] =	{func:talkMessage, desc:'��ʾ��Ϣ'};
	scriptCodes[0x09] =	{func:updateScreenAndWait, desc:'��Ļ�ػ沢�ȴ�'};
	scriptCodes[0x16] =	{func:setNpcTile, desc:'����Npc����'};
	scriptCodes[0x8E] =	{func:clearTalk, desc:'��նԻ�'};
	scriptCodes[0x49] =	{func:setObjectStatus, desc:'���ö���״̬'};
	scriptCodes[0x70] =	{func:roleWalk, desc:'�ƶ�����λ��'};
	scriptCodes[0x73] =	{func:clearWithEffect, desc:'�������'};

	scriptCodes[0x6C] =	{func:npcWalk, desc:'Npc�ƶ�����'};
	scriptCodes[0x10] =	{func:npcWalk2, desc:'Npc�ƶ���ָ��λ��x10'};
	scriptCodes[0x11] =	{func:npcWalk3, desc:'Npc�ƶ���ָ��λ��x11'};

	scriptCodes[0x59] =	{func:setScene, desc:'�޸ĳ���id'};
	scriptCodes[0x50] =	{func:toggleScene, desc:'�л�����'};
	scriptCodes[0x40] =	{func:setTrigMode, desc:'���ö��󴥷���ʽ'};
	scriptCodes[0x85] =	{func:waitSecond, desc:'waitSecond'};

	scriptCodes[0x24] =	{func:setNpcAutoScr, desc:'���ö����Զ��ű�  (��ʼ�ӽű�) '};
	scriptCodes[0x25] =	{func:setNpcTrigScr, desc:'���ö��󴥷��ű�'};

	scriptCodes[0x1E] =	{func:setMoney, desc:'��Ǯ�ı�ָ��'};
	scriptCodes[0x1F] =	{func:obtain, desc:'�����Ʒ'};

	scriptCodes[0x6E] =	{func:walkHeroByOffset, desc:'�����ƶ�ָ������'};
	scriptCodes[0x14] =	{func:setNpcFrame, desc:'�ı���״ָ��'};
	scriptCodes[0x87] =	{func:walkAtPlace, desc:'�ڵ�ǰ�ط�, �����߶�'};
	scriptCodes[0x6F] =	{func:replaceObject, desc:'replaceObject'};

	scriptCodes[0xFFFF] =	{func:talk, desc:'��ʾ�Ի�'};




	var mx, my, mhalf;//, mapX, mapY;


	///��ɫ���
	var roles = [{
		type   : 'role',
		x : 0,
		y : 0,
		layer : 0,
		tileId : 0,
		frame : 0,
		index : 0,
		count : 0
	}];


	var ownItems = [];


	function setRolePos(sx, sy, shalf) {
		mx = sx;
		my = sy;
		mhalf = shalf;

		calcMap();
	}

	//0x65 = 101 ���ö�Ա����
	function setRoleTile(roleId, tileId, bool) {
		roles[roleId].tileId = tileId;
	}

	//0x15 = 21  ���ö�Ա����/֡
	function setRoleIndex(dir, frame, roleId) {
		roles[roleId].dir = dir;
		roles[roleId].frame = frame;
		roles[roleId].count = -1;

		if (dir) {
			refreshRoleCount(roles[roleId]);
		}
	}

	function calcMap() {
		mapX = mx * 32 + mhalf * 16;		//mhalf, ���һ��
		mapY = my * 16 + mhalf * 8;

		roles[0].x = mapX;
		roles[0].y = mapY;

		update(true);
	}

	//��ʱʱ, ����1.2֮���л�
	function refreshRoleCount(role) {
		role.count = role.count === undefined ? -1 : role.count;			//Ĭ��Ϊ -1

		var count = role.count++;

		var frame = count == -1 ? 0 : (count % 2 + 1);
		switch (role.dir) {
			case 0 :			//down:
				frame += 0;
				break;
			case 1 :			//left :
				frame += 3;
				break;
			case 2 :			//up :
				frame += 6;
				break;
			case 3 :			//right :
				frame += 9;
				break;
		}

		role.frame = frame;

	}

	//0x75
	function setRoleGroup() {

	}

	//0x70 �ƶ�����λ��, Ҫ��ͼ���µ�
	function roleWalk(sx, sy, shalf, context) {
		var current = this;

		mx = sx;
		my = sy;
		mhalf = shalf;

		Npc.anim(roles[0], sx, sy, shalf, 4);
	}

	//0x73 �������
	function clearWithEffect() {

	}

	function walkHeroByOffset(dx, dy) {
		if (dx <= 65536/2) {
			mapX += dx;
		} else {
			mapX -= 65536 - dx;
		}
		if (dy <= 65536/2) {
			mapY += dy;
		} else {
			mapY -= 65536 - dy;
		}

		roles[0].x = mapX;
		roles[0].y = mapY;

		mx = Math.floor(mapX/32);
		my = Math.floor(mapY/16);
		mhalf = Math.round((mapX - mx * 32) / 16)

		refreshRoleCount(roles[0]);
		update(true);		//update back
	}

	//0x16 �޸�NPC״̬
	function setNpcTile(objId, dir, frame) {		//roleId, �ƺ�û��
		//roleId && eventObjects[objId].roleId = roleId;
		var obj = objId == 0xFFFF ? this : eventObjects[objId];

		obj.dir = dir;
		obj.frame = frame;
		obj.count = -1;		//����count
		if (dir) {
			refreshRoleCount(obj);
		}
	}

	//0x49 ���ö���״̬
	function setObjectStatus(objId, state) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];

		obj.state = state;
		if (state == 2) {			//�Զ������ű�
			Script.startAutoScript(obj);
		}
	}

	function startEventTrig(obj) {
		Script.startTrigScript(obj);
	}

	//0x40
	function setTrigMode(objId, trigMode) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];

		obj.trigMode = trigMode;
	}

	//0x6c Npc�ƶ�, ��̬��Ʒ, �����޸�frame
	function npcWalk(objId, dx, dy) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];

		var x = obj.x;
		var y = obj.y;

		if (dx <= 65536/2) {
			x += dx;
		} else {
			x -= 65536 - dx;
		}
		if (dy <= 65536/2) {
			y += dy;
		} else {
			y -= 65536 - dy;
		}

		//Npc.anim2(obj, x, y, 1);
		obj.x = x;
		obj.y = y;
	}

	//0x0E   only this
	function setEastDir(objId) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];
		Script.sleep(2);
	}
	//0x0C   only this
	function setWestDir(objId) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];
		Script.sleep(2);
		
	}
	//0x0D   only this
	function setNorthDir(objId) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];
		Script.sleep(2);
		
	}
	//0x0B  only this
	function setSouthDir(objId) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];
		Script.sleep(2);
		
	}

	//0x0F
	function setNpcDir(dir) {
		if (loadMgoCount(this.roleId) < 12) {
			this.frame = dir;
		} else {
			this.dir = dir;
			refreshRoleCount(this);
		}
	}

	//0x10 ��ǰ�����ƶ�
	function npcWalk2(x, y, half, context) {
		Npc.anim(this, x, y, half, 6);	//(this.id==0x0b?6:3));
	}

	//0x11 �ȴ�npc�ƶ�
	function npcWalk3(x, y, half) {
		Npc.anim(this, x, y, half, 2);
	}

	//0x87
	function walkAtPlace() {
		loadFrameCount(this);

		this.frame = Math.floor(Math.random() * this.frameCount);

		//var context = arguments[3];
		//context.stop();		//todo:
	}

	function loadFrameCount(obj) {
		if (!obj.frameCount) {
			obj.frameCount = loadMgoCount(obj.roleId);
		}
	}

	//0x6F
	function replaceObject() {
		//var context = arguments[3];
		//context.stop();		//todo:

		//TODO:
		Thread.currentThread.stop();
	}

	//0x24
	function setNpcAutoScr(objId, autoScr) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];			//0x13d6 ��FFFF
		obj.autoScr = autoScr;
		Script.startAutoScript(obj);
	}

	//0x25 ���ö��󴥷��ű�
	function setNpcTrigScr(objId, trigScr) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];			//0x12C0

		obj.trigScr = trigScr;

		//alert('setNpcTrigScr ����ֱ�Ӵ�����, �������ٿ�');
		//Script.startTrigScript(obj);		//����ֱ�Ӵ���
	}

	//0x14 �ı䵱ǰ�¼���ͼ��
	function setNpcFrame(frame) {
		this.frame = frame;

		return Script.Moment;
	}

	//0x43 ��������
	function setMusic() {

	}

	//0x45
	function setFightMusic() {

	}

	//0x59
	function setScene(sceneId) {
		nextSceneId = sceneId;
	}

	//0x50
	function toggleScene() {
		var scene = scenes[nextSceneId];
		mapId = scene.mapId;
		nextScriptId = scene.enterScriptId;
		startEventId = scene.startEventId;
		endEventId = scene.endEventId;

		console.log('�л����� : ' + nextSceneId + ' ' + mapId + ' ' + nextScriptId + ' ' + startEventId + ' ' + endEventId);

		anims = {};			//��ն���
		drawMapAll();
		update(true);		//Ŀǰ����, ֻ�е�һ���ǲ���Ҫˢ�µ�, ��Ϊ��ʱʲô���ݻ�û����,

		//����ǽű�����, ����Ҫ�첽, ��������������
		setTimeout(function() {
			Script.startScene(scene);
		});
	}

	function finishCode() {
		Script.finish();
	}

	//0x01		//ָֹͣ��, �����õ�ַ, ��Ϊ��һ������
	function stopCode() {
		Script.stop();		//todo:
	}

	//0x02
	var c = 0;
	function changeScript(scriptId, count) {
		//Script.stop(scriptId);		//todo:
		if (c++ <= count) {
			Script.next(scriptId);
		}
	}

	//0x03 ��������ת
	function gotoScript(scriptId) {
		Script.next(scriptId);		//todo:
	}

	//0x04 ִ���ӽű�, ֮��, �践��
	function subScript(scriptId) {
		Script.sub(scriptId);		//todo:
		//this.scriptId = scriptId;
	}

	//0x06  �������
	function randomScript() {
		//...
	}



	//0xFFFF ��ʾ�Ի�
	function talk(msgId, y, z) {
		Talk.drawTalk(msgId);
	}
	
	//0x05	�ػ���Ļ
	//���һ������, Ϊ�Ƿ�ִ�е�ǰ��Ʒ�Ľű�, ��𻨾�, 0x9AEC
	function updateScreen(arg1, arg2, isExecItemScr) {
		update();
	}

	//0x09 �ػ沢�ȴ�, 100����
	function updateScreenAndWait(time, y, z) {
		//update();

		Script.sleep(time);
	}

	//0x85	wait
	function waitSecond(time, y, z, context) {
		//update();

		Script.sleep(time);
	}



	function checkTalk() {
		alert('global checkTalk');
	}




	////////////////////////////////////////////////

	//0x1E �õ���Ǯ
	function setMoney(add, other) {		//add ���ӵĽ��, other, �����ĵ�ַ
		
	}

	//0x1F �����Ʒ
	function obtain(ballId) {
		ownItems.push(ballId);

	}











	//******  �ű�����  ******/
	function executeExample() {

		//�ű�
		//setMusic(31, 0, 0);				//1. 
		//setFightMusic(37, 0, 0);			//2.
		setRolePos(0x29, 0x12, 0);			//3.	46.	����pos: 41, 18
		setRoleTile(0, 0x2, 0);			//4.	65. ��������00, C1
		setRoleIndex(0, 0, 0);				//5.	15. ���÷���0
		setRoleGroup(1);					//6.	75  ����
		//updateScreen();						//7.	05. ��Ļ�ػ�
		//talk(31);							//8		31�ŶԻ�



		//setInterval(update, 1000);
	}



