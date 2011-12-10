/** Timer **/

(function(){

	var Timer = {
		queue : queue, 
		start : start,
		stop : stop
	}
	Timer.__defineGetter__('DEBUG', function() {
		return {
			anims : anims,
			animIndex : animIndex
		}
	});


	var frameCount = 6;		//������Ϸ�ٶ�
	var anims = [];				//animCallback
	var animIndex = 0;		//������

	//����� npc, ֻ�������̵߳ȴ�ʱִ��
	function setTimer(func) {
		var index = animIndex++;
		anims[index] = func;
		return index;
	}

	function clearTimer(index) {
		delete anims[index];
	}

	//�������, ����ִ�ж��ٴ�
	function queue(total, func, callback, force) {
		var timer = setTimer(function(c) {
			func && func(c);
			if (c >= total && total != -1) {
				clearTimer(timer);
				if (force) {
					Timer.stop();
				}
				callback && callback();

			}
		});

		if (force) {
			Timer.start();
		}
	}

	var pause = true;

	//start Draw
	function draw() {
		setInterval(function() {

			if (pause) {
				return ;
			}
			
			var start = new Date().getTime();
			drawLoop();
			var end = new Date().getTime();
			//console.log('timer ' + (end-start) + 'ms');

		}, 1000 / frameCount);
	}


	var drawCount = 0;

	function drawLoop() {

		//console.log('[drawLoop] ' + (drawCount++))

		var c = 0;
		for(var key in anims) {
			var func = anims[key];
			var index = func.index || 0;
			func(index+1);
			func.index = index + 1;

			c++;
		}
		c && update();
	}

	function start() {
		update();		//updateһ��, ��Ҫ���ڳ����д����ű�ִ�����, û��timer�ű�
		pause = false;
	}

	function stop() {
		pause = true;
	}

	window.Timer = Timer;

	draw();
})();