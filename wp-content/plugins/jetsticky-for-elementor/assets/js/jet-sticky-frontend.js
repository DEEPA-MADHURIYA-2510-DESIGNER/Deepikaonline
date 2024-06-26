(function($, elementor) {

    'use strict';

    var JetSticky = {

        init: function() {
            elementor.hooks.addAction('frontend/element_ready/column', JetSticky.elementorColumn);
            elementor.hooks.addAction('frontend/element_ready/container', JetSticky.elementorColumn);

            elementorFrontend.hooks.addAction('frontend/element_ready/section', JetSticky.setStickySection);
            elementorFrontend.hooks.addAction('frontend/element_ready/container', JetSticky.setStickySection);

            $(JetSticky.stickySection);
        },

        elementorColumn: function($scope) {
            var $target = $scope,
                $window = $(window),
                columnId = $target.data('id'),
                editMode = Boolean(elementor.isEditMode()),
                settings = {},
                stickyInstance = null,
                stickyInstanceOptions = {
                    topSpacing: 50,
                    bottomSpacing: 50,
                    containerSelector: '.elementor-section',
                    innerWrapperSelector: '.elementor-widget-wrap',
                };

            if (!editMode) {
                settings = $target.data('jet-sticky-column-settings');

                if ($target.hasClass('jet-sticky-column-sticky')) {

                    if (-1 !== settings['stickyOn'].indexOf(elementorFrontend.getCurrentDeviceMode())) {

                        $target.each(function() {

                            var $this = $(this),

                                elementType = $this.data('element_type');

                            if (elementType !== 'container') {

                                stickyInstanceOptions.topSpacing = settings['topSpacing'];
                                stickyInstanceOptions.bottomSpacing = settings['bottomSpacing'];

                                $target.data('stickyColumnInit', true);
                                stickyInstance = new StickySidebar($target[0], stickyInstanceOptions);

                                $window.on('resize.JetStickyColumnSticky orientationchange.JetStickyColumnSticky', JetStickyTools.debounce(50, resizeDebounce));

                            } else {
                                $this.addClass('jet-sticky-container-sticky');
                                $this.css({
                                    'top': settings['topSpacing'],
                                    'bottom': settings['bottomSpacing']
                                });
                            }
                        });
                    }
                }

            } else {
                return false;
            }

            function resizeDebounce() {
                var currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
                    availableDevices = settings['stickyOn'] || [],
                    isInit = $target.data('stickyColumnInit');

                if (-1 !== availableDevices.indexOf(currentDeviceMode)) {

                    if (!isInit) {
                        $target.data('stickyColumnInit', true);
                        stickyInstance = new StickySidebar($target[0], stickyInstanceOptions);
                        stickyInstance.updateSticky();
                    }
                } else {
                    $target.data('stickyColumnInit', false);
                    stickyInstance.destroy();
                }
            }

        },

        columnEditorSettings: function(columnId) {
            var editorElements = null,
                columnData = {};

            if (!window.elementor.hasOwnProperty('elements')) {
                return false;
            }

            editorElements = window.elementor.elements;

            if (!editorElements.models) {
                return false;
            }

            $.each(editorElements.models, function(index, obj) {

                $.each(obj.attributes.elements.models, function(index, obj) {
                    if (columnId == obj.id) {
                        columnData = obj.attributes.settings.attributes;
                    }
                });

            });

            return {
                'sticky': columnData['jet_sticky_column_sticky_enable'] || false,
                'topSpacing': columnData['jet_sticky_column_sticky_top_spacing'] || 50,
                'bottomSpacing': columnData['jet_sticky_column_sticky_bottom_spacing'] || 50,
                'stickyOn': columnData['jet_sticky_column_sticky_enable_on'] || ['desktop', 'tablet', 'mobile']
            }
        },

        getStickySectionsDesktop: [],
        getStickySectionsTablet: [],
        getStickySectionsMobile: [],

        setStickySection: function($scope) {
            var setStickySection = {

                target: $scope,

                isEditMode: Boolean(elementorFrontend.isEditMode()),

                init: function() {
                    if (this.isEditMode) {
                        return;
                    }

                    if ('yes' === this.getSectionSetting('jet_sticky_section_sticky')) {
                        var availableDevices = this.getSectionSetting('jet_sticky_section_sticky_visibility') || [];

                        if (!availableDevices[0]) {
                            return;
                        }

                        if (-1 !== availableDevices.indexOf('desktop')) {
                            JetSticky.getStickySectionsDesktop.push($scope);
                        }

                        if (-1 !== availableDevices.indexOf('tablet')) {
                            JetSticky.getStickySectionsTablet.push($scope);
                        }

                        if (-1 !== availableDevices.indexOf('mobile')) {
                            JetSticky.getStickySectionsMobile.push($scope);
                        }
                    }
                },

                getSectionSetting: function(setting) {
                    var settings = {},
                        editMode = Boolean(elementorFrontend.isEditMode());

                    if (editMode) {
                        if (!elementorFrontend.hasOwnProperty('config')) {
                            return;
                        }

                        if (!elementorFrontend.config.hasOwnProperty('elements')) {
                            return;
                        }

                        if (!elementorFrontend.config.elements.hasOwnProperty('data')) {
                            return;
                        }

                        var modelCID = this.target.data('model-cid'),
                            editorSectionData = elementorFrontend.config.elements.data[modelCID];

                        if (!editorSectionData) {
                            return;
                        }

                        if (!editorSectionData.hasOwnProperty('attributes')) {
                            return;
                        }

                        settings = editorSectionData.attributes || {};
                    } else {
                        settings = this.target.data('settings') || {};
                    }

                    if (!settings[setting]) {
                        return;
                    }

                    return settings[setting];
                }
            };

            setStickySection.init();
        },

        stickySection: function() {
            var stickySection = {

                isEditMode: Boolean(elementorFrontend.isEditMode()),

                correctionSelector: $('#wpadminbar'),

                initDesktop: false,
                initTablet: false,
                initMobile: false,

                init: function() {

                    var _this = this;

                    if (this.isEditMode) {
                        return;
                    }

                    $(document).ready(function() {
                        _this.run();
                    });

                    $(window).on('resize.JetStickySection orientationchange.JetStickySection', this.run.bind(this));
                },

                getOffset: function() {
                    var offset = 0;

                    if (this.correctionSelector[0] && 'fixed' === this.correctionSelector.css('position')) {
                        offset = this.correctionSelector.outerHeight(true);
                    }

                    return offset;
                },

                run: function() {
                    var currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
                        transitionIn = 'jet-sticky-transition-in',
                        transitionOut = 'jet-sticky-transition-out',
                        options = {
                            stickyClass: 'jet-sticky-section-sticky--stuck',
                            topSpacing: this.getOffset()
                        };

                    function initSticky(section, options) {
                        section.jetStickySection(options)
                            .on('jetStickySection:stick', function(event) {
                                $(event.target).addClass(transitionIn);
                                setTimeout(function() {
                                    $(event.target).removeClass(transitionIn);
                                }, 3000);
                            })
                            .on('jetStickySection:unstick', function(event) {
                                $(event.target).addClass(transitionOut);
                                setTimeout(function() {
                                    $(event.target).removeClass(transitionOut);
                                }, 3000);
                            });
                        section.trigger('jetStickySection:activated');
                    }

                    if ('desktop' === currentDeviceMode && !this.initDesktop) {
                        if (this.initTablet) {
                            JetSticky.getStickySectionsTablet.forEach(function(section, i) {
                                section.trigger('jetStickySection:detach');
                            });

                            this.initTablet = false;
                        }

                        if (this.initMobile) {
                            JetSticky.getStickySectionsMobile.forEach(function(section, i) {
                                section.trigger('jetStickySection:detach');
                            });

                            this.initMobile = false;
                        }

                        if (JetSticky.getStickySectionsDesktop[0]) {
                            JetSticky.getStickySectionsDesktop.forEach(function(section, i) {

                                if (JetSticky.getStickySectionsDesktop[i + 1]) {
                                    options.stopper = JetSticky.getStickySectionsDesktop[i + 1];
                                } else {
                                    options.stopper = '';
                                }

                                initSticky(section, options);
                            });

                            this.initDesktop = true;
                        }
                    }

                    if ('tablet' === currentDeviceMode && !this.initTablet) {
                        if (this.initDesktop) {
                            JetSticky.getStickySectionsDesktop.forEach(function(section, i) {
                                section.trigger('jetStickySection:detach');
                            });

                            this.initDesktop = false;
                        }

                        if (this.initMobile) {
                            JetSticky.getStickySectionsMobile.forEach(function(section, i) {
                                section.trigger('jetStickySection:detach');
                            });

                            this.initMobile = false;
                        }

                        if (JetSticky.getStickySectionsTablet[0]) {
                            JetSticky.getStickySectionsTablet.forEach(function(section, i) {
                                if (JetSticky.getStickySectionsTablet[i + 1]) {
                                    options.stopper = JetSticky.getStickySectionsTablet[i + 1];
                                } else {
                                    options.stopper = '';
                                }

                                initSticky(section, options);
                            });

                            this.initTablet = true;
                        }
                    }

                    if ('mobile' === currentDeviceMode && !this.initMobile) {
                        if (this.initDesktop) {
                            JetSticky.getStickySectionsDesktop.forEach(function(section, i) {
                                section.trigger('jetStickySection:detach');
                            });

                            this.initDesktop = false;
                        }

                        if (this.initTablet) {
                            JetSticky.getStickySectionsTablet.forEach(function(section, i) {
                                section.trigger('jetStickySection:detach');
                            });

                            this.initTablet = false;
                        }

                        if (JetSticky.getStickySectionsMobile[0]) {
                            JetSticky.getStickySectionsMobile.forEach(function(section, i) {

                                if (JetSticky.getStickySectionsMobile[i + 1]) {
                                    options.stopper = JetSticky.getStickySectionsMobile[i + 1];
                                } else {
                                    options.stopper = '';
                                }

                                initSticky(section, options);
                            });

                            this.initMobile = true;
                        }
                    }
                }
            };

            stickySection.init();
        }
    };

    $(window).on('elementor/frontend/init', JetSticky.init);

    var JetStickyTools = {
        debounce: function(threshold, callback) {
            var timeout;

            return function debounced($event) {
                function delayed() {
                    callback.call(this, $event);
                    timeout = null;
                }

                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(delayed, threshold);
            };
        }
    }

}(jQuery, window.elementorFrontend));