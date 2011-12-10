
	Thread = function(scriptId, o, type, callback) {
		this.scriptId = scriptId;
		this.obj = o;			//��ǰ��obj
		this.type = type;			//��ǰ��obj
		this.callback = callback;

		//this.start();
	}

	Thread.currentThread = null;

	Thread.prototype.start = function() {
		this.finish = false;
		this.next();
	}

	//npc ֹͣ, Ӧ�ô�npcs ȥ��
	Thread.prototype.stop = function() {
		this.finish = true;
		Thread.currentThread = null;

		this.callback && this.callback();

		//�����stopҲ����һ��
		if (this.type != 'auto') {
			Timer.start();
		}
	}

	Thread.prototype.wait = function() {
		this.pause = true;
	}

	Thread.prototype.notify = function() {
		this.pause = false;
		this.next();
	}


	Thread.prototype.next = function() {


		while(!this.pause && !this.finish) {

			Thread.currentThread = this;

			var script = scripts[this.scriptId++];		//��ִ�е���, ��ȡһ����
			if (!script) {
				alert('Thread.prototype.next');
				continue;
			}

			var code = scriptCodes[script.code];
			if (!code) {
				console.log('[warn] [NPC'+ toHex(this.obj.id) +' ' + toHex(this.scriptId-1) + ']: execute ' + toHex(script.code) + ' ' + toHex(script.param1) + ' ' + toHex(script.param2) + ' ' + toHex(script.param3));
				continue;
			}

			if (!script.code) {
				this.stop();
				break;
			}

			var tab = this.type.charAt(0).toUpperCase();
			console.log('[info] [' + tab + ' ' + toHex(this.obj.id) +' ' + toHex(this.scriptId-1) + ']: execute '  + toHex(script.code) + ' ' + toHex(script.param1) + ' ' + toHex(script.param2) + ' ' + toHex(script.param3) + ' ' + code.desc);

			if (code.func) {
				code.func.call(this.obj, script.param1, script.param2, script.param3);
			}
		}
	}


	Thread.prototype.isNextTalk = function() {
		var script = scripts[this.scriptId];
		if (!script) return false;

		return script.code === 0xFFFF;
	}


	Thread.prototype.isNextTalks = function() {
		var script = scripts[this.scriptId];
		if (!script) return false;

		return script.code === 0xFFFF || script.code === 0x3C || script.code === 0x3D || script.code === 0x8E;
	}



