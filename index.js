var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var actionName = /** @class */ (function () {
    function actionName() {
        this.parse = 'parse';
        this.transform = 'transform';
        this.filterTime = 'filterTime';
    }
    return actionName;
}());
var WebworkerManger = /** @class */ (function () {
    function WebworkerManger(url) {
        if (url === void 0) { url = './webworker.js'; }
        this.worker = null;
        this.actionHandlerMap = new Map();
        this.url = '';
        this.uuid = 0;
        this.url = url;
        this.worker = new Worker(this.url);
        this.init();
    }
    Object.defineProperty(WebworkerManger.prototype, "Ins", {
        get: function () {
            if (this.worker == null) {
                this.worker = new Worker(this.url);
                this.init();
            }
            return this.worker;
        },
        enumerable: true,
        configurable: true
    });
    WebworkerManger.prototype.init = function () {
        this.worker.onmessage = this.onmessage.bind(this);
    };
    WebworkerManger.prototype.onmessage = function (e) {
        var id = e.data.id;
        if (!this.actionHandlerMap.has(id))
            return;
        this.actionHandlerMap.get(id).call(this, e);
        this.actionHandlerMap.delete(id);
        this.close();
    };
    WebworkerManger.prototype.postMessage = function (action) {
        var _this = this;
        var id = this.uuid++;
        var worker = this.Ins;
        return new Promise(function (resolve, reject) {
            var message = __assign({ id: id }, action);
            worker.postMessage(message);
            _this.actionHandlerMap.set(id, function (res) {
                resolve(res);
            });
        });
    };
    WebworkerManger.prototype.close = function () {
        this.worker.terminate();
        this.worker = null;
    };
    return WebworkerManger;
}());
export { WebworkerManger };
