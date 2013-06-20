;(function($) {
    $.fn.gallery = function(options) {

        var defaults = {
            show_item_count: 1,
            btn_previous_page: '',
            btn_next_page: '',
            btn_previous_image: '',
            btn_next_image: '',
            animate: 100,
            start_item_count: 0,
            disable_css_class_name: 'disable',
            current_css_class_name: 'current',
            image_lazy_load: false,
            current_item_change_callback: function() {}
        };

        var settings = $.extend({}, defaults, options);

        function gallery($gallery) {

            var $items = $gallery.children();
            var items_length = $items.length;
            var current_item_count = 0;
            var max_item_count = items_length - 1;
            var min_item_count = 0;
            var item_change_step = 1;
            var current_page_start_count = 0;
            var max_page_start_count = items_length - settings.show_item_count;
            var min_page_start_count = 0; 
            var $btn_previous_page = $(settings.btn_previous_page);
            var $btn_next_page = $(settings.btn_next_page);
            var $btn_previous_image = $(settings.btn_previous_image);
            var $btn_next_image = $(settings.btn_next_image);

            var page_enable = true;
            if(settings.show_item_count > items_length) {
                settings.show_item_count = items_length;
                page_enable = false;
                $btn_previous_page.addClass(settings.disable_css_class_name);
                $btn_next_page.addClass(settings.disable_css_class_name);
                image_lazy_load(0, items_length);

                if(items_length <= 1) {
                    $btn_previous_image.addClass(settings.disable_css_class_name);
                    $btn_next_image.addClass(settings.disable_css_class_name);
                }
            }

            $gallery.wrap('<div style="width: ' + settings.width * settings.show_item_count + 'px; overflow: hidden;"></div>');
            $gallery.attr("style", 'width:' + items_length * settings.width +'px;');
            $items.attr("style", 'float: left;');

            change_current_item(settings.start_item_count);

            $items.each(function(i, item) {
                $(item).click(function() {
                    change_current_item(i);
                });
            });

            $btn_previous_page.click(function() {
                change_page_start(current_page_start_count - settings.show_item_count);
            });

            $btn_next_page.click(function() {
                change_page_start(current_page_start_count + settings.show_item_count);
            });

            $btn_previous_image.click(function() {
                change_current_item(current_item_count - item_change_step);
            });

            $btn_next_image.click(function() {
                change_current_item(current_item_count + item_change_step);
            });

            function change_page_start(page_start_count) {
                if(!page_enable) {
                    return false;
                }
                $btn_previous_page.removeClass(settings.disable_css_class_name);
                $btn_next_page.removeClass(settings.disable_css_class_name);
                if(page_start_count <= min_page_start_count) {
                    page_start_count = min_page_start_count;
                    $btn_previous_page.addClass(settings.disable_css_class_name);
                }
                if(page_start_count >= max_page_start_count) {
                    page_start_count = max_page_start_count;
                    $btn_next_page.addClass(settings.disable_css_class_name);
                }

                if(settings.image_lazy_load) {
                    image_lazy_load(page_start_count, settings.show_item_count);
                }

                current_page_start_count = page_start_count;

                var margin_left = - page_start_count * settings.width;
                $gallery.animate({
                    marginLeft: margin_left 
                }, settings.animate);
            }

            function change_current_item(next_item_count) {
                $btn_previous_image.removeClass(settings.disable_css_class_name);
                $btn_next_image.removeClass(settings.disable_css_class_name);
                if(next_item_count <= min_item_count) {
                    next_item_count = min_item_count;
                    $btn_previous_image.addClass(settings.disable_css_class_name);
                }
                if(next_item_count >= max_item_count) {
                    next_item_count = max_item_count;
                    $btn_next_image.addClass(settings.disable_css_class_name);
                }

                var $current_item = $($items.get(next_item_count));

                $items.removeClass(settings.current_css_class_name);
                $current_item.addClass(settings.current_css_class_name);

                change_page_start(next_item_count - Math.floor(settings.show_item_count / 2));
                current_item_count = next_item_count;

                settings.current_item_change_callback(current_item_count, $current_item);
            }

            function image_lazy_load(start, count) {
                for(var i = 0; i < count; i++) {
                    var $current_img = $($items.get(start + i)).find('img');
                    $current_img.attr('src', $current_img.attr('data-src'));
                }
            }
        }

        return this.each(function() {
            gallery($(this));
        });

    };
})(jQuery);

