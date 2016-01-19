/*
 * jQuery MantellaWeeker (mWeeker) v.0.1 plugin
 * Copyright (c) 2014 Vasilij Olhov
 * Dual licensed under the MIT and GPL licenses
*/

;(function($) {

    // ================================================
    // =============== DEFAULT OPTIONS ================
    // ================================================
    var dt		 = new Date(),
    	opts	 = null,
    	defaults = {
                        now			: dt,
                        autoload	: true,
                        event		: {
                                         url_get	: './',
                                         url_add	: './add',
                                         url_update	: './update',
                                         url_remove	: './remove',
                                         params     : {},
                                         view  	 	: '{id}',
                                         popup      : null,
                                         addForm	: null,
                                         updForm	: null
                        },
						callback	: {
                                         onEventsLoad		: null,
                                         onEventAdd			: null,
                                         onEventAddWindow 	: null,
                                         onEventUpdate		: null,
                                         onEventUpdateWindow: null,
                                         onEventRemove		: null,
                                         onError			: null
						},
						locale		: {
                                         buttons    : {
                                                         prev_month     : "Previous month",
                                                         prev_week      : "Previous week",
                                                         curr_week      : "Current week",
                                                         next_week      : "Next week",
                                                         next_month     : "Next month",
                                                         create_event	: "Create",
        	                                             modify_event	: "Save",
            	                                         remove_event	: "Remove"
                                         },
                                         captions	: {
	                                                     title			: "Events: ",
	                                                     create_event	: "Create a new event",
    	                                                 modify_event	: "Update event",
    	                                                 footer			: "From %from% to %to% was found %records% items"
                                         },
                                         days    		: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                                         long_months	: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                                         short_months	: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                         error 			: 'Application server error'
                        }
		};






    // =================================================
    // =============== EXTERNAL METHODS =================
    // ================================================
    var methods = {

    	init: function(params) {
     		opts = $.extend(true, {}, defaults, params);
            this.data('opts',opts);

            buildCalendar.call(this);
    		buildWeek.call( this, _calculateDates(opts.now) );

    		if (opts.autoload) {
	    		loadEvents.call(
	    			this,
    				this.find('div.weekday[weekday="1"]').first().attr('dt'),
        			this.find('div.weekday[weekday="7"]').first().attr('dt')
				);
			};

			return this;
        },

		getEvents: function( params ) {
	        var opts = this.data('opts');
	        opts.event.params = params;
	        this.data('opts', opts);

    	    loadEvents.call(
    	    	this,
        		this.find('div.weekday[weekday="1"]').first().attr('dt'),
        		this.find('div.weekday[weekday="7"]').first().attr('dt')
			);

	    	return this;
	    },

	    // Clear all events or by condition { field:'X', value: 'Y' }
	    clearEvents: function( condition ) {
	    	clearEvents.call( this, condition );
    		return this;
	    }

    };







    // ===================================================================================================================
    // ============================= BUILD FUNCTIONS =====================================================================
    // ===================================================================================================================
    var buildCalendar = function() {
 		var me		= this,
 			opts	= me.data('opts');

        // --- Create header ---
        var head = $('<div class="mweeker-header">' +
                     '	<div class="mweeker-navigation">' +
                     '		<div class="title">'+opts.locale.captions.title+'</div>' +
                     '      <div class="nav-btn next-month" title="'+opts.locale.buttons.next_month+'"></div>' +
                     '      <div class="nav-btn next-week" title="'+opts.locale.buttons.next_week+'"></div>' +
                     '      <div class="nav-btn curr-week" title="'+opts.locale.buttons.curr_week+'"></div>' +
                     '      <div class="nav-btn prev-week" title="'+opts.locale.buttons.prev_week+'"></div>' +
                     '      <div class="nav-btn prev-month" title="'+opts.locale.buttons.prev_month+'"></div>' +
                     '		<div class="clr"></div>' +
                     '	</div>' +
                     '  <div class="mweeker-weekdays">' +
                     '		<div class="weekday monday" weekday="1"><span>' + opts.locale.days[0] + '</span></div>' +
                     '		<div class="weekday tuesday" weekday="2"><span>' + opts.locale.days[1] + '</span></div>' +
                     '		<div class="weekday wednesday" weekday="3"><span>' + opts.locale.days[2] + '</span></div>' +
                     '		<div class="weekday thursday" weekday="4"><span>' + opts.locale.days[3] + '</span></div>' +
                     '		<div class="weekday friday" weekday="5"><span>' + opts.locale.days[4] + '</span></div>' +
                     '		<div class="weekday saturday" weekday="6"><span>' + opts.locale.days[5] + '</span></div>' +
                     '		<div class="weekday sunday" weekday="7"><span>' + opts.locale.days[6] + '</span></div>' +
                     '		<div class="clr"></div>' +
                     '  </div>' +
                     '</div>');
        head.find('div.weekday').append('<div class="event-add-button" title="'+opts.locale.captions.create_event+'"></div>');

        // --- Create body ---
        var body = $('<div class="mweeker-body">' +
        	   		 '  <table cellpadding="0" cellpadding="0" cellspacing="0" border="0" width="100%">' +
        			 '  </table>' +
        	    	 '</div');
		for(var i=0; i<24; i++) {
			body.find('table').append(
				  '<tr>' +
                  '  <td valign="top">' +
                  '		<div class="hour monday" weekday="1" hour="'+i+'"></div>' +
                  '		<div class="hour tuesday" weekday="2" hour="'+i+'"></div>' +
                  '		<div class="hour wednesday" weekday="3" hour="'+i+'"></div>' +
                  '		<div class="hour thursday" weekday="4" hour="'+i+'"></div>' +
                  '		<div class="hour friday" weekday="5" hour="'+i+'"></div>' +
                  '		<div class="hour saturday" weekday="6" hour="'+i+'"></div>' +
                  '		<div class="hour sunday" weekday="7" hour="'+i+'"></div>' +
                  '		<div class="clr"></div>' +
                  '  </td>' +
               	  '</tr>'
   			);
        }

        // --- Create footer ---
        var footer = $('<div class="mweeker-footer"></div>');

        // --- Draw ---
        me.empty()
          .addClass('mweeker')
          .append( head )
          .append( body )
          .append( footer )
          .after( '<div class="mweeker-popup-window"></div>' );

        _resize.call(this,true);

        // save tempplates to views and prepare windows
        me.data('wins', {
            'view'    : opts.event.view.html(),
            'popup'   : opts.event.popup.html(),
            'addForm' : opts.event.addForm.html(),
            'updForm' : opts.event.updForm.html()
        });
        opts.event.view.remove();
        opts.event.popup.remove();
        opts.event.addForm.remove();
        opts.event.updForm.remove();

        buildEventWindows.call(me);
        bindCommonActions.call(me);
    };


    var buildWeek = function( dates ) {
        var me 		= this,
        	opts 	= me.data('opts');

        for(var i=0; i<dates.length; i++) {
            me.find('.mweeker-header .weekday[weekday="'+dates[i].weekday+'"]').first()
              .attr('dt', _dateToStr(dates[i].date,'%Y-%m-%d') )
              .removeClass('today')
              .addClass( dates[i].today ? 'today' : '')
              .find('span').first().empty().html( opts.locale.days[i] + ', ' + dates[i].date.getDate() + '.' + opts.locale.short_months[dates[i].date.getMonth()] );
        }

		me.find('.mweeker-header .title').html( opts.locale.captions.title + opts.locale.long_months[dates[0].date.getMonth()] + _dateToStr(dates[0].date,', %Y') );

    	// Calculate next and previous month/years for navigation buttons
        me.find('.mweeker-navigation div.nav-btn.prev-month').attr( 'dt', _dateToStr( _addPeriod(dates[0].date,'m',-1),'%Y-%m-%d') );
        me.find('.mweeker-navigation div.nav-btn.prev-week').attr( 'dt', _dateToStr( _addPeriod(dates[0].date,'d',-7),'%Y-%m-%d') );
        me.find('.mweeker-navigation div.nav-btn.curr-week').attr( 'dt', _dateToStr( new Date(), '%Y-%m-%d') );
        me.find('.mweeker-navigation div.nav-btn.next-week').attr( 'dt', _dateToStr( _addPeriod(dates[0].date,'d',7),'%Y-%m-%d') );
        me.find('.mweeker-navigation div.nav-btn.next-month').attr( 'dt', _dateToStr( _addPeriod(dates[0].date,'m',1),'%Y-%m-%d') );
    };


	// Build the window for event actions
    var buildEventWindows = function() {
        var me		= this,
        	opts 	= me.data('opts'),
        	wins	= me.data('wins'),
        	content = "";

        content = '<div class="mweeker-event-window mweeker-add-event-window">' +
                  '  <div class="header"><span class="title">'+opts.locale.captions.create_event+'</span><span class="close_button"></span></div>' +
                  '  <div class="body">' +
                  '    <input type="hidden" name="id" value="" />' +
                  '	   <div class="form">'+wins.addForm+'</div>' +
                  '	   <div class="button submit-button">'+opts.locale.buttons.create_event+'</div>' +
                  '  </div>' +
                  '</div>';
        me.append( content );

        content = '<div class="mweeker-event-window mweeker-update-event-window">' +
                  '  <div class="header"><span class="title">'+opts.locale.captions.modify_event+'</span><span class="close_button"></span></div>' +
                  '  <div class="body">' +
                  '    <input type="hidden" name="id" value="" />' +
                  '	   <div class="form">'+wins.updForm+'</div>' +
	              '	   <div class="button remove-button">'+opts.locale.buttons.remove_event+'</div>' +
                  '	   <div class="button submit-button">'+opts.locale.buttons.modify_event+'</div>' +
                  '  </div>' +
                  '</div>';
        me.append( content );

        me.append( '<div class="mweeker-event-window-overlay"></div>' );
    };


    var buildFooter = function() {
    	var me		= this,
    		opts	= me.data('opts'),
    		dates 	= me.find('.mweeker-header .mweeker-weekdays .weekday'),
    		str		= opts.locale.captions.footer;

		str = str.replace(/%from%/gi, 	dates.first().attr('dt') )
    	 		 .replace(/%to%/gi,	dates.last().attr('dt') )
    	 		 .replace(/%records%/gi, me.find('.event').length );
    	me.find('.mweeker-footer').html( str );
    };


    var buildAndAddEvent = function(data) {
		var me			= this,
			opts		= me.data('opts'),
			eventView 	= opts.event.view.html(),
			weekday 	= null,
			ceil 		= null,
			event 		= null,
			weekday 	= me.find('div.mweeker-weekdays div.weekday[dt="'+data.date.substr(0,10)+'"]').first().attr('weekday'),
        	ceil 		= me.find('.mweeker-body .hour[hour="'+parseInt(data.date.substr(11,2))+'"][weekday="'+weekday+'"]');

		for(var field in data) { eventView = eventView.replace( new RegExp('{'+field+'}','g') , data[field] ); }
        event = $('<div class="event" event="'+data.id+'">'+eventView+'</div>');
        event.data( data );
        ceil.append( event );
        bindEventActions.call(me, event );
    };


    var buildPopupWindowContent = function ( data ) {
 		var view = this.data('wins').popup;
        for(var field in data) { view = view.replace( new RegExp('{'+field+'}','g') , data[field] ); }
        return view;
	};











    // ===================================================================================================================
    // ============================= PRIVATE HELPER FUNCTIONS ============================================================
    // ===================================================================================================================

	// Perform sizes for elements in list
	var _resize = function( initial ) {
		var me			= this,
			header 		= me.find('.mweeker-header'),
			weekdays	= header.find('.mweeker-weekdays').first(),
			body		= me.find('.mweeker-body').first(),
			footer		= me.find('.mweeker-footer').first(),
			colWidth	= 100;

        body.find('div.hour').each( function(i,itm) {
        	var me = $(this);
        	me.css('height', (me.text()=="") ? '1px' : 'auto');
        });

        colWidth	= Math.floor( ( body.width() - (body.width()-body[0].clientWidth)) / 7 );
        body.find('div.hour').outerWidth(colWidth,true);
		weekdays.find('div.weekday').outerWidth(colWidth,true);

		body.outerHeight( me.height() -
						  header.outerHeight(true) -
						  footer.outerHeight(true) -
						  (body.outerHeight(true)-body.height())
						 , true);

		if (!initial) { buildFooter.call(me); }
	};


    // Calculate period of showed dates to display into calendar
    var _calculateDates = function( currentDate ) {
        var currentDay 	= (currentDate.getDay() == 0) ? 7 : currentDate.getDay(),
            mondayDate 	= new Date( _addPeriod( currentDate,'d', -1*(currentDay-1) ) ),
            today		= new Date(),
            now,
            result = [];
        today = _dateToStr(today,'%d%m%y')
        for (var i=0; i<7; i++) {
            now = new Date( _addPeriod(mondayDate,'d',i) );
            result.push({
                weekday	: (i+1),
                date	: now,
                today	: (today == _dateToStr(now,'%d%m%y'))
            });
        }
        return result;
    };


    // Format date to string: %Y=Year(4 dig.), %y=Year(2 dig.), %m=Month(2 dig.), %d=Date(2 dig.)
    var _dateToStr = function( date, format) {
        var ret = '';
        ret = format.replace(/%d/g, (date.getDate()<10)? '0'+date.getDate() : date.getDate() );
        ret = ret.replace(/%m/g, ((date.getMonth()+1)<10) ? '0'+(date.getMonth()+1) : (date.getMonth()+1) );
        ret = ret.replace(/%Y/g, date.getFullYear());
        ret = ret.replace(/%y/g, date.getYear());
        return ret;
    };


    // Add period to date: WHAT: y=year, m=month, d=day
    var _addPeriod = function(date, what, val) {
        var ret = new Date(date);
        switch (what) {
            case 'd': return (new Date(date.getTime() + val*24*60*60*1000)); break;
            case 'm': ret.setMonth(date.getMonth()+val); return ret; break;
            case 'y': ret.setYear(date.getFullYear()+val); return ret; break;
            default: return date;
        }
    };








    // ===================================================================================================================
    // ============================= AJAX REQUESTS AND HANDLER ===========================================================
    // ===================================================================================================================
    var doRequest = function(request, data ) {
        var me 		= this,
        	opts	= me.data('opts');

        data['_uncache'] = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
        $.ajax({
                 type:        (request=="get") ? "GET" : "POST",
                 url:         opts.event['url_'+request],
                 dataType:    "json",
                 data:        data,
                 success:     function(json) {
                 				if (json.success) { requestHandler[request].call( me, json.message, json.data ); }
                     			else {
                                	if ( opts.callback.onError) {
                                   	 	opts.callback.onError.call( this, json.message );
                                   	}
                        		}
                 },
                 error :    function(obj,response) {
                 				if ( opts.callback.onError) {
                 				  opts.callback.onError.call( this, opts.locale.error );
                 				}
                 },
                 complete:	function() { me.find('div.mweeker-event-window div.body div.button').removeClass('progress'); }
        });
    };


    // Handle responces from server on any actions
    var requestHandler = {
        get: function( message, data ) {
                var opts = this.data('opts');
                for(var i=0; i<data.length; i++) { buildAndAddEvent.call(this, data[i]); }
                _resize.call(this);
                if ( opts.callback.onEventsLoad ) { opts.callback.onEventsLoad.call( this, data ); }
        },
        add:  function( message, data ) {
        		var opts = this.data('opts');
                buildAndAddEvent.call(this,data);
                _resize.call(this);
                closeEventWindow.call(this);
                if ( opts.callback.onEventAdd) { opts.callback.onEventAdd.call( this, message,  data ); }
        },
        update: function( message, data ) {
                   var opts = this.data('opts');
                   this.find('.mweeker-body div.event[event="'+data.id+'"]').remove();
                   buildAndAddEvent.call(this,data);
                   _resize.call(this);
                   closeEventWindow.call(this);
                   if ( opts.callback.onEventUpdate) { opts.callback.onEventUpdate.call( this, message, data ); }
        },
        remove: function( message, event_id ) {
                   var opts = this.data('opts');
                   var event = this.find('.mweeker-body div.event[event="'+event_id+'"]'),
                   	   data = event.data();
                   event.remove()
                   _resize.call(this);
                   closeEventWindow.call(this);
                   if ( opts.callback.onEventRemove) { opts.callback.onEventRemove.call( this, message, data ); }
        }
    };










    // ===================================================================================================================
    // ============================= EVENTS ACTIONS ======================================================================
    // ===================================================================================================================

    var loadEvents = function( from, to ) {
    	var me 		= this,
    		opts	= me.data('opts');

    	clearEvents.call(me);
    	var params = opts.event.params;
		params['_from']  = from;
		params['_till']  = to;
        doRequest.call(me, "get", params );
    };


    var saveEvent = function( data ) {
    	doRequest.call(this, ( (data.id) ? "update" : "add" ), data );
    };


    var removeEvent = function( data ) {
        doRequest.call(this, "remove", data );
    };


    var clearEvents = function( condition ) {
       var me = this;

       if ( (typeof condition !== "object") || $.isEmptyObject(condition) ) { // clear all events
       	 me.find('.mweeker-body div.event').remove();
       }
       else { // clear events by condition { field, value }
         var data = {};
         me.find('.mweeker-body div.event').each( function(i, item) {
            data = $(item).data();
            if ( data[condition.field] == condition.value ) {
            	$(item).remove();
            }
         });
       }
       _resize.call(me);
    };


    var showEventWindow = function( event, data ) {
        var me  	= this,
        	opts	= me.data('opts'),
        	win 	= null,
        	offset 	= me.offset();

    	if ($.isEmptyObject(data)) {
			var date = $(event.currentTarget.parentElement).attr('dt');

            win = me.find('div.mweeker-event-window.mweeker-add-event-window').first();
            win.find('input, select, textarea').val('');
            win.find('input[name="date"]').val( $(event.currentTarget.parentElement).attr('dt') );
            win.find('input[name="time"]').val( '12:00' );
			if ( opts.callback.onEventAddWindow ) { if ( false === opts.callback.onEventAddWindow.call(this, win, date) ) { return false; } }
        }
        else {
            win  = me.find('div.mweeker-event-window.mweeker-update-event-window').first();
            for(var field in data) {
            	win.find('input[name="'+field+'"], select[name="'+field+'"], textarea[name="'+field+'"]').val( data[field] );
            }
            if ( opts.callback.onEventUpdateWindow ) { if ( false === opts.callback.onEventUpdateWindow.call(this, win, data) ) { return false; } }
        }
        me.find('div.mweeker-event-window-overlay').first().fadeIn(200);
        win.find('div.button').removeClass('progress');
        win.css('left', Math.floor((me.width()-win.width())/2) + offset.left)
           .css('top',  Math.floor((me.height()-win.height())/3) + offset.top)
           .fadeIn(200);
    };


	var closeEventWindow = function() {
        var me = this;
        me.find('div.mweeker-event-window-overlay').first().fadeOut(100);
        me.find('div.mweeker-event-window:visible').first().hide();
    };










    // ===================================================================================================================
    // ============================= BIND ACTIONS ========================================================================
    // ===================================================================================================================
    var bindCommonActions = function() {
    	var me 		= this,
    		opts	= me.data('opts');

        // Action: click on change month/year navigation button -> redraw calendar
    	me.find('div.mweeker-navigation div.nav-btn').on('click', function() {
            var root = $(this).parents('.mweeker').first(),
            	date = new Date( $(this).attr('dt') );
            buildWeek.call(me, _calculateDates(date) );
            loadEvents.call(
            	me,
        		me.find('div.weekday[weekday="1"]').first().attr('dt'),
        		me.find('div.weekday[weekday="7"]').first().attr('dt')
			);
    	});


    	// Show event window to ADD event
    	me.find('.mweeker-header .weekday div.event-add-button').on('click', function(event) {
    		showEventWindow.call(me, event, {} );
	    });

    	// Close event window
	    me.find('div.mweeker-event-window span.close_button').on('click', function() {
    	    if ( $(this).parents('div.mweeker-event-window').first()
        	            .find('div.submit-button').first()
            	        .hasClass('progress') ) { return false; }
	        closeEventWindow.call(me);
    	});

    	// Add/Update button clicked in event-window
    	me.find('div.mweeker-event-window div.submit-button').on('click', function() {
        	if ($(this).hasClass('progress')) { return false; }
        	$(this).addClass('progress');

        	var data = {};
        	$(this).parent().find('input,select,textarea').each( function(i, field) {
            	data[ $(field).attr('name') ] =  $(field).val();
        	});
        	saveEvent.call(me, data);
    	});

    	// Delete button clicked in event-window
    	me.find('div.mweeker-event-window div.remove-button').on('click', function() {
        	if ($(this).hasClass('progress')) { return false; }
        	$(this).addClass('progress');

        	var eventId = $(this).parent().find('input[name="id"]').first().val();
        	removeEvent.call(me, {id:eventId} );
    	});

    };


    var bindEventActions = function( event ) {
    	var me 		= this,
    		opts	= me.data('opts'),
    		wins	= me.data('wins');

    	event.on('mouseenter', function() {
    		if (!wins.popup) { return false; }

        	var window	 = me.next('div.mweeker-popup-window').first(),
            	content  = buildPopupWindowContent.call(me, $(this).data() );

        	window.empty().append(content).show();
	    })
    	.on('mouseleave', function() {
    		if (!wins.popup) { return false; }
        	me.next('div.mweeker-popup-window').first().hide();
    	})
    	.on('mousemove', function(event) {
        	if (!wins.popup) { return false; }
        	me.next('div.mweeker-popup-window').first()
          	  .css('left', parseInt(event.pageX+10) )
		  	  .css('top' , parseInt(event.pageY+10) );
    	})
    	.on('click', function(event) {
    		showEventWindow.call(me, event, $(this).data() );
	    });

        return me;
    };








    // =================================================
    // ============ EXTERNAL ENTRY POINT ===============
    // =================================================
    $.fn.mWeeker = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) { return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 )); }
        else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) { return methods.init.apply( this, arguments ); }
        else { return false; }
    };

})(jQuery);

