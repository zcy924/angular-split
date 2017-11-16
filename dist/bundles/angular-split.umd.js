(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs/Subject'), require('rxjs/add/operator/debounceTime')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'rxjs/Subject', 'rxjs/add/operator/debounceTime'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.angularSplit = {}),global.ng.core,global.ng.common,global.Rx));
}(this, (function (exports,core,common,Subject) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * angular-split
 *
 * Areas size are set in percentage of the split container.
 * Gutters size are set in pixels.
 *
 * So we set css 'flex-basis' property like this (where 0 <= area.size <= 1):
 *  calc( { area.size * 100 }% - { area.size * nbGutter * gutterSize }px );
 *
 * Examples with 3 visible areas and 2 gutters:
 *
 * |                     10px                   10px                                  |
 * |---------------------[]---------------------[]------------------------------------|
 * |  calc(20% - 4px)          calc(20% - 4px)              calc(60% - 12px)          |
 *
 *
 * |                          10px                        10px                        |
 * |--------------------------[]--------------------------[]--------------------------|
 * |  calc(33.33% - 6.667px)      calc(33.33% - 6.667px)      calc(33.33% - 6.667px)  |
 *
 *
 * |10px                                                  10px                        |
 * |[]----------------------------------------------------[]--------------------------|
 * |0                 calc(66.66% - 13.333px)                  calc(33%% - 6.667px)   |
 *
 *
 *  10px 10px                                                                         |
 * |[][]------------------------------------------------------------------------------|
 * |0 0                               calc(100% - 20px)                               |
 *
 */
var SplitComponent = (function () {
    function SplitComponent(elRef, cdRef, renderer) {
        this.elRef = elRef;
        this.cdRef = cdRef;
        this.renderer = renderer;
        this._direction = 'horizontal';
        this._useTransition = false;
        this._disabled = false;
        this._width = null;
        this._height = null;
        this._gutterSize = 10;
        this.dragStart = new core.EventEmitter(false);
        this.dragProgress = new core.EventEmitter(false);
        this.dragEnd = new core.EventEmitter(false);
        this.gutterClick = new core.EventEmitter(false);
        this.transitionEndInternal = new Subject.Subject();
        this.transitionEnd = (/** @type {?} */ (this.transitionEndInternal.asObservable())).debounceTime(20);
        this.isDragging = false;
        this.draggingWithoutMove = false;
        this.currentGutterNum = 0;
        this.displayedAreas = [];
        this.hidedAreas = [];
        this.dragListeners = [];
        this.dragStartValues = {
            sizePixelContainer: 0,
            sizePixelA: 0,
            sizePixelB: 0,
            sizePercentA: 0,
            sizePercentB: 0,
        };
    }
    Object.defineProperty(SplitComponent.prototype, "direction", {
        get: /**
         * @return {?}
         */
        function () {
            return this._direction;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            var _this = this;
            v = (v === 'vertical') ? 'vertical' : 'horizontal';
            this._direction = v;
            this.displayedAreas.concat(this.hidedAreas).forEach(function (area) {
                area.comp.setStyleVisibleAndDir(area.comp.visible, _this.isDragging, _this.direction);
            });
            this.build();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "useTransition", {
        get: /**
         * @return {?}
         */
        function () {
            return this._useTransition;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
            this._useTransition = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "disabled", {
        get: /**
         * @return {?}
         */
        function () {
            return this._disabled;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
            this._disabled = v;
            this.build();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "width", {
        get: /**
         * @return {?}
         */
        function () {
            return this._width;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._width = (!isNaN(v) && v > 0) ? v : null;
            this.build();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "height", {
        get: /**
         * @return {?}
         */
        function () {
            return this._height;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._height = (!isNaN(v) && v > 0) ? v : null;
            this.build();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "gutterSize", {
        get: /**
         * @return {?}
         */
        function () {
            return this._gutterSize;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._gutterSize = !isNaN(v) && v > 0 ? v : 10;
            this.build();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "cssFlexdirection", {
        get: /**
         * @return {?}
         */
        function () {
            return (this.direction === 'horizontal') ? 'row' : 'column';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "cssWidth", {
        get: /**
         * @return {?}
         */
        function () {
            return this.width ? this.width + "px" : '100%';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "cssHeight", {
        get: /**
         * @return {?}
         */
        function () {
            return this.height ? this.height + "px" : '100%';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "cssMinwidth", {
        get: /**
         * @return {?}
         */
        function () {
            return (this.direction === 'horizontal') ? this.getNbGutters() * this.gutterSize + "px" : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "cssMinheight", {
        get: /**
         * @return {?}
         */
        function () {
            return (this.direction === 'vertical') ? this.getNbGutters() * this.gutterSize + "px" : null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SplitComponent.prototype.getNbGutters = /**
     * @return {?}
     */
    function () {
        return this.displayedAreas.length - 1;
    };
    /**
     * @param {?} comp
     * @return {?}
     */
    SplitComponent.prototype.addArea = /**
     * @param {?} comp
     * @return {?}
     */
    function (comp) {
        var /** @type {?} */ newArea = {
            comp: comp,
            order: -1,
            size: -1,
        };
        if (comp.visible === true) {
            this.displayedAreas.push(newArea);
        }
        else {
            this.hidedAreas.push(newArea);
        }
        comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);
        this.build();
    };
    /**
     * @param {?} comp
     * @return {?}
     */
    SplitComponent.prototype.updateArea = /**
     * @param {?} comp
     * @return {?}
     */
    function (comp) {
        // Only refresh if area is displayed (No need to check inside 'hidedAreas')
        var /** @type {?} */ item = this.displayedAreas.find(function (a) { return a.comp === comp; });
        if (item) {
            this.build();
        }
    };
    /**
     * @param {?} comp
     * @return {?}
     */
    SplitComponent.prototype.removeArea = /**
     * @param {?} comp
     * @return {?}
     */
    function (comp) {
        if (this.displayedAreas.some(function (a) { return a.comp === comp; })) {
            var /** @type {?} */ area = /** @type {?} */ (this.displayedAreas.find(function (a) { return a.comp === comp; }));
            this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            this.build();
        }
        else if (this.hidedAreas.some(function (a) { return a.comp === comp; })) {
            var /** @type {?} */ area = /** @type {?} */ (this.hidedAreas.find(function (a) { return a.comp === comp; }));
            this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
        }
    };
    /**
     * @param {?} comp
     * @return {?}
     */
    SplitComponent.prototype.hideArea = /**
     * @param {?} comp
     * @return {?}
     */
    function (comp) {
        var /** @type {?} */ area = /** @type {?} */ (this.displayedAreas.find(function (a) { return a.comp === comp; }));
        if (area) {
            comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);
            var /** @type {?} */ areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            (_a = this.hidedAreas).push.apply(_a, areas);
            this.build();
        }
        var _a;
    };
    /**
     * @param {?} comp
     * @return {?}
     */
    SplitComponent.prototype.showArea = /**
     * @param {?} comp
     * @return {?}
     */
    function (comp) {
        var /** @type {?} */ area = /** @type {?} */ (this.hidedAreas.find(function (a) { return a.comp === comp; }));
        if (area) {
            comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);
            var /** @type {?} */ areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
            (_a = this.displayedAreas).push.apply(_a, areas);
            this.build();
        }
        var _a;
    };
    /**
     * @return {?}
     */
    SplitComponent.prototype.build = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.stopDragging();
        // ¤ AREAS ORDER
        // Based on user input if all provided or added order by default.
        if (this.displayedAreas.every(function (a) { return a.comp.order !== null; })) {
            this.displayedAreas.sort(function (a, b) { return (/** @type {?} */ (a.comp.order)) - (/** @type {?} */ (b.comp.order)); });
        }
        this.displayedAreas.forEach(function (area, i) {
            area.order = i * 2;
            area.comp.setStyleOrder(area.order);
        });
        // ¤ AREAS SIZE PERCENT
        // Set css 'flex-basis' property depending on user input if all set & ~100% or equal sizes by default.
        var /** @type {?} */ totalUserSize = /** @type {?} */ (this.displayedAreas.reduce(function (total, s) { return s.comp.size ? total + s.comp.size : total; }, 0));
        if (this.displayedAreas.some(function (a) { return a.comp.size === null; }) || totalUserSize < .999 || totalUserSize > 1.001) {
            var /** @type {?} */ size_1 = 1 / this.displayedAreas.length;
            this.displayedAreas.forEach(function (area) {
                area.size = size_1;
            });
        }
        else {
            // If some provided % are less than gutterSize > set them to zero and dispatch % to others.
            var /** @type {?} */ percentToShare_1 = 0;
            // Get container pixel size
            var /** @type {?} */ containerSizePixel_1 = this.getNbGutters() * this.gutterSize;
            if (this.direction === 'horizontal') {
                containerSizePixel_1 = this.width ? this.width : this.elRef.nativeElement['offsetWidth'];
            }
            else {
                containerSizePixel_1 = this.height ? this.height : this.elRef.nativeElement['offsetHeight'];
            }
            this.displayedAreas.forEach(function (area) {
                var /** @type {?} */ newSize = Number(area.comp.size);
                if (newSize * containerSizePixel_1 < _this.gutterSize) {
                    percentToShare_1 += newSize;
                    newSize = 0;
                }
                area.size = newSize;
            });
            if (percentToShare_1 > 0) {
                var /** @type {?} */ nbAreasNotZero = this.displayedAreas.filter(function (a) { return a.size !== 0; }).length;
                var /** @type {?} */ percentToAdd_1 = percentToShare_1 / nbAreasNotZero;
                this.displayedAreas.filter(function (a) { return a.size !== 0; }).forEach(function (area) {
                    area.size += percentToAdd_1;
                });
            }
        }
        this.refreshStyleSizes();
        this.cdRef.markForCheck();
    };
    /**
     * @return {?}
     */
    SplitComponent.prototype.refreshStyleSizes = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ sumGutterSize = this.getNbGutters() * this.gutterSize;
        this.displayedAreas.forEach(function (area) {
            area.comp.setStyleFlexbasis("calc( " + area.size * 100 + "% - " + area.size * sumGutterSize + "px )", _this.isDragging);
        });
    };
    /**
     * @param {?} startEvent
     * @param {?} gutterOrder
     * @param {?} gutterNum
     * @return {?}
     */
    SplitComponent.prototype.startDragging = /**
     * @param {?} startEvent
     * @param {?} gutterOrder
     * @param {?} gutterNum
     * @return {?}
     */
    function (startEvent, gutterOrder, gutterNum) {
        var _this = this;
        startEvent.preventDefault();
        // Place code here to allow '(gutterClick)' event even if '[disabled]="true"'.
        this.currentGutterNum = gutterNum;
        this.draggingWithoutMove = true;
        this.dragListeners.push(this.renderer.listen('document', 'mouseup', function (e) { return _this.stopDragging(); }));
        this.dragListeners.push(this.renderer.listen('document', 'touchend', function (e) { return _this.stopDragging(); }));
        this.dragListeners.push(this.renderer.listen('document', 'touchcancel', function (e) { return _this.stopDragging(); }));
        if (this.disabled) {
            return;
        }
        var /** @type {?} */ areaA = this.displayedAreas.find(function (a) { return a.order === gutterOrder - 1; });
        var /** @type {?} */ areaB = this.displayedAreas.find(function (a) { return a.order === gutterOrder + 1; });
        if (!areaA || !areaB) {
            return;
        }
        var /** @type {?} */ prop = (this.direction === 'horizontal') ? 'offsetWidth' : 'offsetHeight';
        this.dragStartValues.sizePixelContainer = this.elRef.nativeElement[prop];
        this.dragStartValues.sizePixelA = areaA.comp.getSizePixel(prop);
        this.dragStartValues.sizePixelB = areaB.comp.getSizePixel(prop);
        this.dragStartValues.sizePercentA = areaA.size;
        this.dragStartValues.sizePercentB = areaB.size;
        var /** @type {?} */ start;
        if (startEvent instanceof MouseEvent) {
            start = {
                x: startEvent.screenX,
                y: startEvent.screenY,
            };
        }
        else if (startEvent instanceof TouchEvent) {
            start = {
                x: startEvent.touches[0].screenX,
                y: startEvent.touches[0].screenY,
            };
        }
        else {
            return;
        }
        this.dragListeners.push(this.renderer.listen('document', 'mousemove', function (e) { return _this.dragEvent(e, start, areaA, areaB); }));
        this.dragListeners.push(this.renderer.listen('document', 'touchmove', function (e) { return _this.dragEvent(e, start, areaA, areaB); }));
        areaA.comp.lockEvents();
        areaB.comp.lockEvents();
        this.isDragging = true;
        this.notify('start');
    };
    /**
     * @param {?} event
     * @param {?} start
     * @param {?} areaA
     * @param {?} areaB
     * @return {?}
     */
    SplitComponent.prototype.dragEvent = /**
     * @param {?} event
     * @param {?} start
     * @param {?} areaA
     * @param {?} areaB
     * @return {?}
     */
    function (event, start, areaA, areaB) {
        if (!this.isDragging) {
            return;
        }
        var /** @type {?} */ end;
        if (event instanceof MouseEvent) {
            end = {
                x: event.screenX,
                y: event.screenY,
            };
        }
        else if (event instanceof TouchEvent) {
            end = {
                x: event.touches[0].screenX,
                y: event.touches[0].screenY,
            };
        }
        else {
            return;
        }
        this.draggingWithoutMove = false;
        this.drag(start, end, areaA, areaB);
    };
    /**
     * @param {?} start
     * @param {?} end
     * @param {?} areaA
     * @param {?} areaB
     * @return {?}
     */
    SplitComponent.prototype.drag = /**
     * @param {?} start
     * @param {?} end
     * @param {?} areaA
     * @param {?} areaB
     * @return {?}
     */
    function (start, end, areaA, areaB) {
        // ¤ AREAS SIZE PIXEL
        var /** @type {?} */ offsetPixel = (this.direction === 'horizontal') ? (start.x - end.x) : (start.y - end.y);
        var /** @type {?} */ newSizePixelA = this.dragStartValues.sizePixelA - offsetPixel;
        var /** @type {?} */ newSizePixelB = this.dragStartValues.sizePixelB + offsetPixel;
        // const debSizePxA = newSizePixelA;
        // const debSizePxB = newSizePixelB;
        if (newSizePixelA < this.gutterSize && newSizePixelB < this.gutterSize) {
            // WTF.. get out of here!
            return;
        }
        else if (newSizePixelA < this.gutterSize) {
            newSizePixelB += newSizePixelA;
            newSizePixelA = 0;
        }
        else if (newSizePixelB < this.gutterSize) {
            newSizePixelA += newSizePixelB;
            newSizePixelB = 0;
        }
        // ¤ AREAS SIZE PERCENT
        // const debSizeA = areaA.size;
        // const debSizeB = areaB.size;
        if (newSizePixelA === 0) {
            areaB.size += areaA.size;
            areaA.size = 0;
        }
        else if (newSizePixelB === 0) {
            areaA.size += areaB.size;
            areaB.size = 0;
        }
        else {
            // NEW_PERCENT = START_PERCENT / START_PIXEL * NEW_PIXEL;
            if (this.dragStartValues.sizePercentA === 0) {
                areaB.size = this.dragStartValues.sizePercentB / this.dragStartValues.sizePixelB * newSizePixelB;
                areaA.size = this.dragStartValues.sizePercentB - areaB.size;
            }
            else if (this.dragStartValues.sizePercentB === 0) {
                areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
                areaB.size = this.dragStartValues.sizePercentA - areaA.size;
            }
            else {
                areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
                areaB.size = (this.dragStartValues.sizePercentA + this.dragStartValues.sizePercentB) - areaA.size;
            }
        }
        // const rd = (val: number) => Math.round(val*100)/100;
        // console.table([{
        //     'start drag PX': rd(this.dragStartValues.sizePixelA) + ' / ' + rd(this.dragStartValues.sizePixelB),
        //     'offset': offsetPixel,
        //     'new temp PX': rd(debSizePxA) + ' / ' + rd(debSizePxB),
        //     'new final PX': rd(newSizePixelA) + ' / ' + rd(newSizePixelB),
        //     'curr %-px': `${ rd(debSizeA)*100 }% / ${ rd(debSizeB)*100 }%`,
        //     'new %-px': `${ rd(areaA.size)*100 }% / ${ rd(areaB.size)*100 }%`,
        // }]);
        this.refreshStyleSizes();
        this.notify('progress');
    };
    /**
     * @return {?}
     */
    SplitComponent.prototype.stopDragging = /**
     * @return {?}
     */
    function () {
        if (this.isDragging === false && this.draggingWithoutMove === false) {
            return;
        }
        this.displayedAreas.forEach(function (area) {
            area.comp.unlockEvents();
        });
        // console.log('>', this.displayedAreas.map(a => a.size).join('/'), '  ', this.displayedAreas.map(a => a.size).reduce((tot, s) => tot+s, 0));
        while (this.dragListeners.length > 0) {
            var /** @type {?} */ fct = this.dragListeners.pop();
            if (fct) {
                fct();
            }
        }
        if (this.draggingWithoutMove === true) {
            this.notify('click');
        }
        else {
            this.notify('end');
        }
        this.isDragging = false;
        this.draggingWithoutMove = false;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    SplitComponent.prototype.notify = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        var /** @type {?} */ areasSize = this.displayedAreas.map(function (a) { return a.size * 100; });
        switch (type) {
            case 'start':
                return this.dragStart.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'progress':
                return this.dragProgress.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'end':
                return this.dragEnd.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'click':
                return this.gutterClick.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'transitionEnd':
                return this.transitionEndInternal.next(areasSize);
        }
    };
    /**
     * @return {?}
     */
    SplitComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.stopDragging();
    };
    SplitComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'split',
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: ["\n        :host {\n            display: flex;\n            flex-wrap: nowrap;\n            justify-content: flex-start;\n            align-items: stretch;\n            overflow: hidden;\n            /* \n                Important to keep following rules even if overrided later by 'HostBinding' \n                because if [width] & [height] not provided, when build() is executed,\n                'HostBinding' hasn't been applied yet so code:\n                this.elRef.nativeElement[\"offsetHeight\"] give wrong value!  \n             */\n            width: 100%;\n            height: 100%;   \n        }\n\n        split-gutter {\n            flex-grow: 0;\n            flex-shrink: 0;\n            background-color: #eeeeee;\n            background-position: center center;\n            background-repeat: no-repeat;\n        }\n    "],
                    template: "\n        <ng-content></ng-content>\n        <ng-template ngFor let-area [ngForOf]=\"displayedAreas\" let-index=\"index\" let-last=\"last\">\n            <split-gutter *ngIf=\"last === false\" \n                          [order]=\"index*2+1\"\n                          [direction]=\"direction\"\n                          [size]=\"gutterSize\"\n                          [disabled]=\"disabled\"\n                          (mousedown)=\"startDragging($event, index*2+1, index+1)\"\n                          (touchstart)=\"startDragging($event, index*2+1, index+1)\"></split-gutter>\n        </ng-template>",
                },] },
    ];
    /** @nocollapse */
    SplitComponent.ctorParameters = function () { return [
        { type: core.ElementRef, },
        { type: core.ChangeDetectorRef, },
        { type: core.Renderer2, },
    ]; };
    SplitComponent.propDecorators = {
        "direction": [{ type: core.Input },],
        "useTransition": [{ type: core.Input },],
        "disabled": [{ type: core.Input },],
        "width": [{ type: core.Input },],
        "height": [{ type: core.Input },],
        "gutterSize": [{ type: core.Input },],
        "dragStart": [{ type: core.Output },],
        "dragProgress": [{ type: core.Output },],
        "dragEnd": [{ type: core.Output },],
        "gutterClick": [{ type: core.Output },],
        "transitionEnd": [{ type: core.Output },],
        "cssFlexdirection": [{ type: core.HostBinding, args: ['style.flex-direction',] },],
        "cssWidth": [{ type: core.HostBinding, args: ['style.width',] },],
        "cssHeight": [{ type: core.HostBinding, args: ['style.height',] },],
        "cssMinwidth": [{ type: core.HostBinding, args: ['style.min-width',] },],
        "cssMinheight": [{ type: core.HostBinding, args: ['style.min-height',] },],
    };
    return SplitComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var SplitAreaDirective = (function () {
    function SplitAreaDirective(elRef, renderer, split) {
        this.elRef = elRef;
        this.renderer = renderer;
        this.split = split;
        this._order = null;
        this._size = null;
        this._minSize = 0;
        this._visible = true;
        this.lockListeners = [];
    }
    Object.defineProperty(SplitAreaDirective.prototype, "order", {
        get: /**
         * @return {?}
         */
        function () {
            return this._order;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._order = !isNaN(v) ? v : null;
            this.split.updateArea(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitAreaDirective.prototype, "size", {
        get: /**
         * @return {?}
         */
        function () {
            return this._size;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._size = (!isNaN(v) && v >= 0 && v <= 100) ? (v / 100) : null;
            this.split.updateArea(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitAreaDirective.prototype, "minSize", {
        get: /**
         * @return {?}
         */
        function () {
            return this._minSize;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._minSize = (!isNaN(v) && v > 0 && v < 100) ? v / 100 : 0;
            this.split.updateArea(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitAreaDirective.prototype, "visible", {
        get: /**
         * @return {?}
         */
        function () {
            return this._visible;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
            this._visible = v;
            if (this.visible) {
                this.split.showArea(this);
            }
            else {
                this.split.hideArea(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SplitAreaDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.split.addArea(this);
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-grow', '0');
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-shrink', '0');
        this.transitionListener = this.renderer.listen(this.elRef.nativeElement, 'transitionend', function (e) { return _this.onTransitionEnd(e); });
    };
    /**
     * @param {?} prop
     * @return {?}
     */
    SplitAreaDirective.prototype.getSizePixel = /**
     * @param {?} prop
     * @return {?}
     */
    function (prop) {
        return this.elRef.nativeElement[prop];
    };
    /**
     * @param {?} isVisible
     * @param {?} isDragging
     * @param {?} direction
     * @return {?}
     */
    SplitAreaDirective.prototype.setStyleVisibleAndDir = /**
     * @param {?} isVisible
     * @param {?} isDragging
     * @param {?} direction
     * @return {?}
     */
    function (isVisible, isDragging, direction) {
        if (isVisible === false) {
            this.setStyleFlexbasis('0', isDragging);
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-x', 'hidden');
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-y', 'hidden');
            if (direction === 'vertical') {
                this.renderer.setStyle(this.elRef.nativeElement, 'max-width', '0');
            }
        }
        else {
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-x', 'hidden');
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-y', 'auto');
            this.renderer.removeStyle(this.elRef.nativeElement, 'max-width');
        }
        if (direction === 'horizontal') {
            this.renderer.setStyle(this.elRef.nativeElement, 'height', '100%');
            this.renderer.removeStyle(this.elRef.nativeElement, 'width');
        }
        else {
            this.renderer.setStyle(this.elRef.nativeElement, 'width', '100%');
            this.renderer.removeStyle(this.elRef.nativeElement, 'height');
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    SplitAreaDirective.prototype.setStyleOrder = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.renderer.setStyle(this.elRef.nativeElement, 'order', value);
    };
    /**
     * @param {?} value
     * @param {?} isDragging
     * @return {?}
     */
    SplitAreaDirective.prototype.setStyleFlexbasis = /**
     * @param {?} value
     * @param {?} isDragging
     * @return {?}
     */
    function (value, isDragging) {
        // If gutter being dragged, disable transition
        if (isDragging === true) {
            this.setStyleTransition(false);
        }
        else {
            this.setStyleTransition(this.split.useTransition === true);
        }
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', value);
    };
    /**
     * @param {?} useTransition
     * @return {?}
     */
    SplitAreaDirective.prototype.setStyleTransition = /**
     * @param {?} useTransition
     * @return {?}
     */
    function (useTransition) {
        if (useTransition) {
            this.renderer.setStyle(this.elRef.nativeElement, 'transition', "flex-basis 0.3s");
        }
        else {
            this.renderer.removeStyle(this.elRef.nativeElement, 'transition');
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SplitAreaDirective.prototype.onTransitionEnd = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // Limit only flex-basis transition to trigger the event
        if (event.propertyName === 'flex-basis') {
            this.split.notify('transitionEnd');
        }
    };
    /**
     * @return {?}
     */
    SplitAreaDirective.prototype.lockEvents = /**
     * @return {?}
     */
    function () {
        this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'selectstart', function (e) { return false; }));
        this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'dragstart', function (e) { return false; }));
    };
    /**
     * @return {?}
     */
    SplitAreaDirective.prototype.unlockEvents = /**
     * @return {?}
     */
    function () {
        while (this.lockListeners.length > 0) {
            var /** @type {?} */ fct = this.lockListeners.pop();
            if (fct) {
                fct();
            }
        }
    };
    /**
     * @return {?}
     */
    SplitAreaDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.unlockEvents();
        if (this.transitionListener) {
            this.transitionListener();
        }
        this.split.removeArea(this);
    };
    SplitAreaDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: 'split-area'
                },] },
    ];
    /** @nocollapse */
    SplitAreaDirective.ctorParameters = function () { return [
        { type: core.ElementRef, },
        { type: core.Renderer2, },
        { type: SplitComponent, },
    ]; };
    SplitAreaDirective.propDecorators = {
        "order": [{ type: core.Input },],
        "size": [{ type: core.Input },],
        "minSize": [{ type: core.Input },],
        "visible": [{ type: core.Input },],
    };
    return SplitAreaDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var SplitGutterDirective = (function () {
    ////
    function SplitGutterDirective(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this._disabled = false;
    }
    Object.defineProperty(SplitGutterDirective.prototype, "order", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'order', v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "direction", {
        get: /**
         * @return {?}
         */
        function () {
            return this._direction;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._direction = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "size", {
        get: /**
         * @return {?}
         */
        function () {
            return this._size;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._size = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "disabled", {
        get: /**
         * @return {?}
         */
        function () {
            return this._disabled;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._disabled = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SplitGutterDirective.prototype.refreshStyle = /**
     * @return {?}
     */
    function () {
        this.renderer.setStyle(this.elementRef.nativeElement, 'flex-basis', this.size + "px");
        // fix safari bug about gutter height when direction is horizontal
        this.renderer.setStyle(this.elementRef.nativeElement, 'height', (this.direction === 'vertical') ? this.size + "px" : "100%");
        var /** @type {?} */ state = (this.disabled === true) ? 'disabled' : this.direction;
        this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', getCursor(state));
        this.renderer.setStyle(this.elementRef.nativeElement, 'background-image', "url(\"" + getImage(state) + "\")");
    };
    SplitGutterDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: 'split-gutter'
                },] },
    ];
    /** @nocollapse */
    SplitGutterDirective.ctorParameters = function () { return [
        { type: core.ElementRef, },
        { type: core.Renderer2, },
    ]; };
    SplitGutterDirective.propDecorators = {
        "order": [{ type: core.Input },],
        "direction": [{ type: core.Input },],
        "size": [{ type: core.Input },],
        "disabled": [{ type: core.Input },],
    };
    return SplitGutterDirective;
}());
/**
 * @param {?} state
 * @return {?}
 */
function getCursor(state) {
    switch (state) {
        case 'disabled':
            return 'default';
        case 'vertical':
            return 'row-resize';
        case 'horizontal':
            return 'col-resize';
    }
    return '';
}
/**
 * @param {?} state
 * @return {?}
 */
function getImage(state) {
    switch (state) {
        case 'vertical':
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC';
        case 'horizontal':
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==';
        case 'disabled':
            return '';
    }
    return '';
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var AngularSplitModule = (function () {
    function AngularSplitModule() {
    }
    /**
     * @return {?}
     */
    AngularSplitModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    };
    /**
     * @return {?}
     */
    AngularSplitModule.forChild = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    };
    AngularSplitModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule
                    ],
                    declarations: [
                        SplitComponent,
                        SplitAreaDirective,
                        SplitGutterDirective,
                    ],
                    exports: [
                        SplitComponent,
                        SplitAreaDirective,
                    ]
                },] },
    ];
    /** @nocollapse */
    AngularSplitModule.ctorParameters = function () { return []; };
    return AngularSplitModule;
}());

exports.AngularSplitModule = AngularSplitModule;
exports.SplitComponent = SplitComponent;
exports.SplitAreaDirective = SplitAreaDirective;
exports.ɵa = SplitGutterDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-split.umd.js.map