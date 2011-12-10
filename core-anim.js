(function() {

	Npc = {
		anim : anim,
		anim2 : anim2
	}

	function anim(o, x, y, half, speed) {
		//���һ���������ڼ���, �Ƿ��ڵȴ�ʱִ��, �����Զ�����
		//��context.trig, ��ʾ, ��context.autoScr
		//////////////////////////////////////////////////

		var cx = o.x;
		var cy = o.y;
		var zx = x * 32 + half * 16;		//half, ���һ��
		var zy = y * 16 + half * 8;

		var s = Math.max(Math.abs(zx - cx), Math.abs(zy - cy));		//����

		var step = Math.ceil(s);		//����
		var current = 0;
		var total = Math.ceil(step/speed);

		var timer = Script.draw(total, function() {
			calcNpcDir(o, zx, zy);

			current += speed;

			if (step != 0) {
				o.x = (zx - cx) * current / step + cx;
				o.y = (zy - cy) * current / step + cy;
			}

			//s = 32 , speed = 3 ʱ�����, �����������
			if (Math.abs(current) >= s) {					//�� s= 0ʱ, ����>�����
				o.x = zx;
				o.y = zy;
			}

		});	

	}

	function anim2(o, x, y, speed) {
		//���һ���������ڼ���, �Ƿ��ڵȴ�ʱִ��, �����Զ�����
		//��context.trig, ��ʾ, ��context.autoScr
		//////////////////////////////////////////////////

		var cx = o.x;
		var cy = o.y;
		var zx = x;		//half, ���һ��
		var zy = y;

		var s = Math.max(Math.abs(zx - cx), Math.abs(zy - cy));		//����

		var step = Math.ceil(s);		//����
		var current = 0;
		var total = Math.ceil(step/speed);

		var timer = Script.draw(total, function() {
			calcNpcDir(o, zx, zy);

			current += speed;

			if (step != 0) {
				o.x = (zx - cx) * current / step + cx;
				o.y = (zy - cy) * current / step + cy;
			}

			//s = 32 , speed = 3 ʱ�����, �����������
			if (Math.abs(current) >= s) {					//�� s= 0ʱ, ����>�����
				o.x = zx;
				o.y = zy;
			}

			o.x = Math.floor(o.x);
			o.y = Math.floor(o.y);

		});	

	}

	function calcNpcDir(o, x, y) {
		if (x > o.x && y > o.y) {
			o.dir = 3;
		} else if (x > o.x && y < o.y) {
			o.dir = 2;
		} else if (x < o.x && y > o.y) {
			o.dir = 0;
		} else if (x < o.x && y < o.y) {
			o.dir = 1;
		} else {
			//alert('calcNpcDir');		����������ֹ�, ������
		}
		refreshRoleCount(o);
	}

})();


