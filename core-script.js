
	Script = {};

	Script.Moment = 0;		//�ȴ�0��, ���ӳ�һ��
	Script.Wait = -1;
	Script.Finish = -2;



	Script.all = [];
	Script.total = 0;
	
	//�����������ǳ���, �����Զ����ߴ����ű�
	Script.startScene = function(scene) {

		Script.all = [];

		Script.start(scene.enterScriptId, scene, 'scene');

		//����event object
		for(var i = startEventId+1; i <= endEventId; i++) {
			var o = eventObjects[i];

			if (!o || o.state == 0 || o.roleId == 0) {
				continue;
			}

			if (o.autoScr) {
				Script.start(o.autoScr, o, 'auto');
			}
		}
	}

	Script.startAutoScript = function(obj) {
		Script.start(obj.autoScr, obj, 'auto');
	}
	Script.startTrigScript = function(obj) {
		Script.start(obj.trigScr, obj, 'trig');
	}
	Script.startItemScript = function(obj) {
		Script.start(obj.useScr, obj, 'item');
	}

	//�����ű�, ��ű��貢��ִ��, ����, ����ڶ�ʵ�������
	Script.start = function(scriptId, obj, type) {

		if (type != 'auto') {
			Timer.stop();
		}


		var script = new Thread(scriptId, obj, type);

		script.index = Script.total;
		Script.all[Script.total++] = script;

		script.start();
	}

	//ʵ����thread.js����, ����breakѭ��
	Script.finish = function() {
		var thread = Thread.currentThread;
		thread.stop();
	}

	Script.stop = function(scriptId) {
		var thread = Thread.currentThread;
		scriptId = scriptId || thread.scriptId;

		if (thread.type == 'auto') {
			thread.obj.autoScr = scriptId;
		} else if (thread.type == 'scene') {
			thread.obj.enterScriptId = scriptId;
		} else if (thread.type == 'trig') {
			thread.obj.trigScr = scriptId;
		}

		//���½ű�״̬ʱ, ����Ƿ�, ��ִ���Զ��ű�
		if (thread.type == 'auto' && thread.obj.state == 2) {
			//thread.scriptId = thread.obj.autoScr;		//����, ����д, ����ѭ��
		}
		thread.stop();

		if (thread.type != 'auto') {
			Timer.start();
		}
	}

	Script.next = function(scriptId) {
		var thread = Thread.currentThread;
		thread.scriptId = scriptId;
	}


	Script.sub = function(scriptId) {
		var thread = Thread.currentThread;
		thread.wait();
		var sub = new Thread(scriptId, thread.obj, thread.type, function() {
			thread.notify();
		});
		sub.parent = thread;
		sub.start();
	}


	Script.isExec = function() {
		//return Thread.currentThread && !Script.isAuto(Thread.currentThread);
		for(k in Script.all) {
			var script = Script.all[k];
			if (!script.finish && script.type != 'auto') {
				return true;
			}
		}
		return false;
	}

	Script.isAuto = function(thread) {
		return thread.type == 'auto';
	}





	//�ȴ�����
	Script.sleep = function(time) {
		//���ӵȴ�����
		//updateScript(script);

		var thread = Thread.currentThread;
		var force = thread.type != 'auto';		//���Զ��ű�Ϊforce, ����������

		thread.wait();
		Timer.queue(time, undefined, function() {
			thread.notify();	
		}, force);
		
	}

	Script.draw = function(total, func) {
		var thread = Thread.currentThread;
		var force = thread.type != 'auto'

		thread.wait();
		Timer.queue(total, func, function() {
			thread.notify();	
		}, force);

	}




