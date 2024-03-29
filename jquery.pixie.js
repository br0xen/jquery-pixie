(function($) {
	var methods = {
		animation: {},
		animation_timer: null,
		init: function(options) {
			var start = false;
			var speed = (1000/30);
			if(options.start && typeof options.start === 'boolean') start = options.start;
			if(options.speed && typeof options.speed === 'number') speed = options.speed;
			if(options.animation && typeof options.animation === 'object') options = options.animation;
			methods.animation = methods.createAnimation(options);
			if(start) methods.start(speed);
		},
		createAnimation: function(a) {
			var x_frames = Math.ceil(a.sprite_sheet.width / a.frame_size.width);
			var y_frames = Math.ceil(a.sprite_sheet.height / a.frame_size.height);
			a.start_point = a.start_point || 0;
			a.end_point = a.end_point || 100;
			a.current_frame = a.current_frame || 0;
			a.loop = a.loop || true;
			a.sprite_sheet.num_frames = x_frames * y_frames;
			a.animate = function(speed){
				// Animation defaults to 30 fps (1000/30)
				speed = speed || (1000/30);
				if(this.step()) {
					var anim_obj = this;
					methods.animation_timer = setTimeout(function(){anim_obj.animate(speed);},speed);
				} else {
					if(this.loop) {
						this.gotoFrame(0);
						this.animate(speed);
					}
				}
			};
			a.step = function(){
				var goto_frame = ++this.current_frame;
				return this.gotoFrame(goto_frame);
			}
			a.gotoFrame = function(frame_num){
				var ret_val = true;
				if(frame_num > this.sprite_sheet.num_frames-1) { 
					frame_num--;
					ret_val = false;
				} else if(frame_num < 0) {
					frame_num = 0;
					ret_val = false;
				}
				var frame_pos_x = ((frame_num * this.frame_size.width) % this.sprite_sheet.width)*-1;
				var frame_pos_y = (Math.floor((frame_num * this.frame_size.width) / this.sprite_sheet.width) * this.frame_size.height)*-1;
				$(this.container).css({backgroundPosition: frame_pos_x+'px '+frame_pos_y+'px'});
				this.current_frame = frame_num;
				return ret_val;
			}
			a.gotoFrame(a.current_frame);
			$(a.container).css({backgroundImage:"url("+a.sprite_sheet.url+")",height:a.frame_size.height,width:a.frame_size.width});
			return a;
		},
		position: function(options) {
			methods.animation.gotoFrame(options);
		},
		start: function(options) {
			speed = options || (1000/30);
			methods.animation.animate(speed);
		},
		stop: function() {
			clearTimeout(methods.animation_timer);
		}
	};

	$.fn.pixie = function(options) {
		// Method calling logic
		if(methods[options]) {
			return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof options === 'object' || ! options) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method '+options+' does not exist on jQuery.pixie');
		}
	};
})(jQuery);
