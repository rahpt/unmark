/*!
    Init for Unmark
*/

(function ($) {

    // Main Init Script
    unmark.init = function () {

        // Define some re-usable elements
        this.nav_panel =                      $('.navigation-pane'),
        this.main_panel =                     $('.main-wrapper'),
        this.main_content =                   $('.main-content'),
        this.sidebar_content =                $('.sidebar-content'),
        this.main_panel_width =               unmark.main_panel.width(),
        this.sidebar_default =                $('.sidebar-default'),
        this.sidebar_mark_info =              $('.sidebar-mark-info'),
        this.body_height =                    $(window).outerHeight(true),
        this.special_chars =                  { '\\+': '&#43;' };
        this.mainpanels =                     $('#unmark-wrapper');
        this.hamburger =                      $('.mobile-header .menu-activator');

        // Check Query String
        var load = unmark.readQuery('load');
        if (load !== false) {
            unmark.overlay(true);
            $('#'+load).show().animate({ top: 0 }, 1000);
        }


        // Set any window variables
        window.unmark_current_page = 1;

        // Animate the body fading in
        if (Modernizr.mq('only screen and (min-width: 480px)')) {
            $('body').animate({opacity: 1}, 1000);
        }

        // Vertical Tabs
        // Shows and Tabs the Vertical navigition inside the Navigation Panel
        $('.navigation-content a, .navigation-pane-links a, .label-list a, .tag-list a').on('click', function (e) {
            unmark.interact_nav(e, $(this));
            return false;
        });

        // Hover Action on Marks List
        // Shows the Archive and More Buttons
        // Temporarily disabled on all device sizes.
        // This caused issues with iPad/Pro.
        // if (Modernizr.mq('only screen and (min-width: 768px)')) {
        //     $(document).on('mouseenter', '.mark', function () {
        //         $(this).addClass('hide-dot');
        //         $(this).find('.mark-actions').fadeIn(200);
        //     });
        //     $(document).on('mouseleave', '.mark', function () {
        //         $(this).removeClass('hide-dot');
        //         $(this).find('.mark-actions').fadeOut(200);
        //     });
        // }

        // Global Button / Action Link Run
        // Create a Function from a string
        $(document).on('click', 'button[data-action], .action', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var action = $(this).data('action'), funct; // Get Data Action Attribute
            funct = eval('unmark.' + action); // Convert it to an executable function
            funct($(this)); // Run it with passed in object
        });

        // Slide Toggle the Sidebar Info Blocks
        $(document).on('click', '.sidebar-info-panel h4.prev-coll', function (e) {
            e.preventDefault();
            var section = $(this).next('section'), arrow = $(this).find('i');
            if (section.is(':visible')) {
                arrow.removeClass('icon-up');
                arrow.addClass('icon-down');
                section.slideUp();
            } else {
                arrow.removeClass('icon-down');
                arrow.addClass('icon-up');
                section.slideDown();
            }
        });

        // Watch for internal link click and run PJAX
        // To Do, remove outside links from elem array
        if ( $('#unmark').length > 0 ) {

            //$(document).pjax(".label-list a[href*='/']", '.main-content');
            $(document).on('submit', '#search-form', function(e) {
                $.pjax.submit(e, '.main-content');
            });
            $(document).on('pjax:complete', function() { // Runs when list is retrieved (example: archive list)
                window.unmark_current_page = 1;
                unmark.main_content.scrollTop(0);
                unmark.main_content.find('.marks').hide().fadeIn();
                unmark.updateDom();
            });
        }

        // Hooks up all functions for client/customer hidden forms
        $('form.ajaxsbmt').on('submit', function (e) {
            e.preventDefault();
            var form = $(this),
                formid = form.attr('id');
            funct = eval('unmark.' + formid);
            funct(form, e);
        });

        $('#helperforms input.field-input').on('keydown change', function () {
            $(this).parent().parent().find('.response-message').hide();
        });

        // Close Overlay
        $(document).on('click', '#unmarkModalClose', function (e) {
            e.preventDefault();
            return unmark.overlay(false);
        });
        $(document).on('click', '#unmark-overlay', function (e) {
            e.preventDefault();
            return unmark.overlay(false);
        });

        // Label Hovers
        $(document).on('mouseenter', '.label-choices li, .sidebar-label-list li', function (e) {
            var label = $(this),
                label_name = label.find('span').text(),
                label_class = label.attr('class');
            $('#label-chosen').show().text(label_name).removeClass().addClass(label_class);
        });
        $(document).on('mouseleave', '.label-choices li, .sidebar-label-list li', function (e) {
            $('#label-chosen').show().hide();
        });

        // Set up Scrolling
        pages_already_loaded = [];
        unmark.main_content.on('scroll', function (e){
            unmark.scrollPaginate($(this));
        });

        // Import Form Init
        $('#importerUnmark').change(function (e) {
            return $('#importForm').submit();
        });
        $('#importerHTML').change(function (e) {
            return $('#importFormHTML').submit();
        });
        $('#importerReadability').change(function (e) {
            return $('#importFormReadability').submit();
        });

        // BURN THIS LATER
        ////////////////////////////////////////////////////////////////////////////

        // Adding & Removing Classes for Mobile Navigation & Sidebar "Sliding"
        $(unmark.hamburger).on( "click", function(e) {
            e.preventDefault();
            $(unmark.hamburger).toggleClass('active');
            $(unmark.mainpanels).removeClass('sidebar-active');
            $(unmark.mainpanels).toggleClass('nav-active');
            return false;
        });


        /*if ( $('#unmark-wrapper').hasClass('nav-active') ) {
            $('.mobile-header .menu-activator').on( "click", function(e) {
                e.preventDefault();
                $('#unmark-wrapper').removeClass('nav-active');
                $(this).toggleClass('active');
            });
        }
        else {
            $('.mobile-header .menu-activator').on( "click", function(e) {
                e.preventDefault();
                $('#unmark-wrapper').removeClass();
                $('#unmark-wrapper').addClass('nav-active');
                $('.mobile-header #mobile-sidebar-show').removeClass('active');
                $(this).toggleClass('active');
            });
        }
        */

        $('.mobile-header #mobile-sidebar-show').on( "click", function(e) {
            e.preventDefault();
            $('#unmark-wrapper').removeClass();
            $('#unmark-wrapper').addClass('sidebar-active');
            $('.mobile-header .menu-activator').removeClass('active');
            $(this).toggleClass('active');
            return false;
        });

        // Show & Hide Search Bar
        $(document).on('click', '.marks-heading-bar .search-button', function(e) {
            e.preventDefault();
            //$(this).closest('.marks-heading-bar').find('.search-bar').fadeIn(300, function(e){
            $('.search-bar').fadeIn(300, function(e){
                setTimeout("$('#search-input').focus();", 0);
            });
            return false;
        });
        $(document).on('click', '.marks-heading-bar .search-bar .close-button', function(e) {
            e.preventDefault();
            $(this).closest('.search-bar').fadeOut(300);
            return false;
        });
        // Show & Hide Add Mark Bar
        $(document).on('click', '.marks-heading-bar .add-mark-button', function(e) {
            e.preventDefault();
            $(this).closest('.marks-heading-bar').find('.add-mark-bar').fadeIn(300);
        });
        $(document).on('click', '.marks-heading-bar .add-mark-bar .close-button', function(e) {
            e.preventDefault();
            $(this).closest('.add-mark-bar').fadeOut(300);
        });

    };

    // Get this baby in action
    $(document).ready(function(){ unmark.init(); });


}(window.jQuery));
