/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*jslint eqeq: true, newcap: true, nomen: true, plusplus: true, browser: true, indent: 2 */
(function () {
  'use strict';

  var Response, _500pxSDK;

  _500pxSDK = function () {
    var self = this,
      oauth_token,
      container,
      site_url = 'https://api.500px.com/',
      version = 'v1',
      api_url = site_url + version,
      events = {},
      public_methods,
      bind_method,
      i,
      method_name,
      original_method,
      random_method_name,
      handle_api_callback,
      toParam,
      fire_event,
      login_callback;

    // Public methods

    // init(options)
    //
    // Initializes the 500px SDK. You must run this command before using the SDK.
    // Options are specified as an object. Valid options are:
    // - `sdk_key` (required) The sdk key for your application. You can obtain this key from (http://500px.com/settings/applications)
    // - `oauth_token` (optional) An oauth token for the current user. If you use `ensureAuthorization`, `login`, `authorization` or `getAuthorizationStatus` this value may be overwritten.
    //
    //    _500px.init({
    //      sdk_key: 'XXXXXXXXXXXXXXXXXXXXXX',
    //    });
    this.init = function (options) {
      if (this.sdk_key) {
        throw 'init: Already initialized';
      }
      if (!options || !options.sdk_key) {
        throw 'init: You must specify an sdk key';
      }
      if (!document.body) {
        throw 'init: Could not find the body element, make sure the document is loaded before calling init';
      }

      this.sdk_key = options.sdk_key;

      if (options && options.oauth_token) {
        oauth_token = options.oauth_token;
      }

      var container_element = document.createElement('div'), remove_container;
      container_element.id = '_500px_container';
      container_element.style.display = 'none';
      container_element.style.width = 0;
      container_element.style.height = 0;
      container_element.style.border = 0;
      container_element.style.margin = 0;
      container_element.style.padding = 0;
      document.body.appendChild(container_element);

      container = document.getElementById('_500px_container');

      remove_container = function () {
        var e = document.getElementById('_500px_container');
        document.body.removeChild(e);
        return null;
      };
    };

    // api(url, http_method, parameters, callback)
    //
    // Executes an API call. All parameters are optional except `url`. `parameters` must be an object and `callback` a function.
    // The callback will be passed a Response object. The response object has these methods:
    //
    //    `success` (boolean) True if no errors occurred, false if errors occured.
    //    `error` (boolean) True if an error occured.
    //    `error_message` (string) The text of the error message.
    //    `status` (integer) The HTTP status code of the response.
    //    `data` (object) The data returned by the API.
    //
    //    _500px.api('/users', function (response) {
    //      console.log('My User Data Is', response.data);
    //    });
    //
    //    _500px.api('/users/937847/friend', 'post', function (response) {
    //      console.log('Now following user ', 937847);
    //    });
    //
    //    _500px.api('/photos/899999', 'put', { name: 'My New Photo Name' }, function (response) {
    //      if (response.success) {
    //        console.log('Your photo was updated');
    //      } else {
    //        console.log('An Error occurred: ', response.error_message);
    //      }
    //    });
    this.api = function () {
      if (!this.sdk_key) {
        throw "api: SDK not initialized. Use _500px.init() first.";
      }
      var args, url, method, data, callback, tag, callback_function_name, tag_src;
      args = Array.prototype.slice.call(arguments); // This converts arguments into an Array
      url = args.shift();
      if (!url || url.replace(/^\s*/, '').replace(/\s*$/, '') == '') {
        throw 'api: You must specify an end point';
      }

      method = 'get';
      if (args[0] && typeof args[0] == 'string') {
        method = args.shift();
      }

      data = {};
      if (args[0] && typeof args[0] == 'object') {
        data = args.shift();
      }

      callback = function () {};
      if (args[0] && typeof args[0] == 'function') {
        callback = args.shift();
      }

      data._method = method;
      if (oauth_token) {
        data.oauth_token = oauth_token;
      }
      data.sdk_key = this.sdk_key;

      // Construct JSONP request
      tag = document.createElement('script');

      callback_function_name = random_method_name();

      window[callback_function_name] = function (data) {
        document.body.removeChild(tag);
        handle_api_callback(callback)(data);
      };

      tag_src = api_url + url + '.jsonp';
      data.callback = callback_function_name;
      tag_src += '?';
      tag_src += toParam(data);
      tag.src = tag_src;
      document.body.appendChild(tag);
    };

    // login([callback])
    //
    // Logs a user in and authorizes your application. You may specify an optional callback function.
    // The callback function will be passed a string. It will be `denied` if the user did not authorize the application and `authorized` if the user accepted.
    // If the user does authorize the application an `authorization_obtained` event will be triggered.
    //
    // Once authorized an oauth token is obtain for the user. When making api requests you will not be logged in as that user.
    //
    //    _500px.login();
    //
    //    _500px.login(function (resposne) {
    //      if (response == 'denied') {
    //        console.log('User did not authorize the app');
    //      } elsif (response == 'authorized') {
    //        console.log('User did authorize the app');
    //      }
    //    });
    this.login = function (callback) {
      if (!this.sdk_key) {
        throw "login: SDK not initialized. Use _500px.init() first.";
      }

      var callback_function_name, left_offset, top_offset;

      callback_function_name = random_method_name();
      window[callback_function_name] = function (parameters) {
        login_callback.call(self, callback, parameters);
      };

      left_offset = (screen.width / 2) - (1240 / 2);
      top_offset = (screen.height / 2) - (480 / 2);

      window.open(site_url + 'api/js-sdk/authorize?sdk_key=' + this.sdk_key + '&callback=' + callback_function_name,
                  '500px_js_sdk_login',
                  'width=1240,height=480,left=' + left_offset + ',top=' + top_offset + ',menu=no,location=yes,scrollbars=no,status=no,toolbar=no');
    };

    // authorize(callback)
    //
    // Alias for `login`.
    this.authorize = function (callback) {
      if (!this.sdk_key) {
        throw "authorize: SDK not initialized. Use _500px.init() first.";
      }
      this.login(callback);
    };

    // ensureAuthorization(callback)
    //
    // Executes callback only if authorization for the user can be obtained.
    // If authorization was previously obtained and an oauth token is present
    // the callback will be executed immediately. Otherwise `getAuthorizationStatus`
    // is used to check if the user has authorized the application & authorizes it if they haven't.
    // If the user declines to authorize the app, or closes the authorization popup the callback will not be called.
    this.ensureAuthorization = function (callback) {
      if (!this.sdk_key) {
        throw "ensureAuthorization: SDK not initialized. Use _500px.init() first.";
      }

      var bound_callback = function () {
        if (callback) {
          callback.call(self);
        }
      };

      if (oauth_token) {
        bound_callback();
        return;
      }

      this.getAuthorizationStatus(function (response) {
        if (response == 'authorized') {
          bound_callback();
        } else {
          self.login(function (response) {
            if (response == 'authorized') {
              bound_callback();
            }
          });
        }
      });
    };

    // getAuthorizationStatus([callback])
    //
    // Determines whether or not the user has authorized your application. If the user has authorized the application it will return and save the user's oauth token.
    // The callback function will be passed a string. Possible values are:
    //    `not_logged_in` The user is not logged in to 500px.
    //    `not_authorized` The user is logged in, but has not authorized your app.
    //    `authorized` The user has authorized your app.
    //
    //    _500px.getAuthorizationStatus(function (response) {
    //      if (response != 'authorized') {
    //        _500px.login();
    //      }
    //    });
    this.getAuthorizationStatus = function (callback) {
      if (!this.sdk_key) {
        throw "getAuthorizationStatus: SDK not initialized. Use _500px.init() first.";
      }

      var callback_function_name = random_method_name(),
        iframe_element = document.createElement('iframe');

      window[callback_function_name] = function (parameters) {
        setTimeout(function () {
          container.removeChild(iframe_element);
        }, 0);

        if (parameters.not_logged_in) {
          oauth_token = null;
          if (callback && typeof callback == 'function') {
            callback('not_logged_in');
          }
        } else if (parameters.not_authorized) {
          oauth_token = null;
          if (callback && typeof callback == 'function') {
            callback('not_authorized');
          }
        } else if (parameters.token) {
          oauth_token = parameters.token;
          fire_event('authorization_obtained');
          if (callback && typeof callback == 'function') {
            callback('authorized');
          }
        }
      };

      iframe_element.src = site_url + 'api/js-sdk/check_authorization?sdk_key=' + this.sdk_key + '&callback=' + callback_function_name;
      container.appendChild(iframe_element);
    };

    // on(event_name, callback)
    //
    // Subscribe to an event
    //    `logout` Fired when the user logs out, or if the API returns an OAuth error (like oauth_token is invalid)
    //    `authorization_obtained` Fired when the SDK obtains an oauth token for a user. For example with `login()` is used, or `getAuthorizationStatus()` returns an `authorized` value.
    //    'authorization_denied' Fired when the user denies authorization for your application.
    this.on = function (event_name, callback) {
      if (!events[event_name]) {
        events[event_name] = [];
      }
      if (typeof callback != 'function') {
        throw 'on: Callback is not a function';
      }

      events[event_name].push(callback);
    };

    // off(event_name[, callback])
    //
    // Unsubscribed from an event. Specify the callback to remove just one funcgtion. Specify no callback to remove all callbacks for an event.
    this.off = function (event_name, callback) {
      var i, current_callback;
      if (callback) {
        if (!events[event_name]) {
          return;
        }
        for (i = 0; i < events[event_name].length; i++) {
          current_callback = events[event_name][i];
          if (current_callback == callback) {
            events[event_name][i] = undefined;
          }
        }
      } else {
        events[event_name] = [];
      }
    };

    // logout
    //
    // Logs the user out from 500px
    this.logout = function (callback) {
      if (!this.sdk_key) {
        throw "logout: SDK not initialized. Use _500px.init() first.";
      }
      if (!oauth_token) {
        throw "logout: User is not logged in";
      }

      var callback_function_name = random_method_name(),
        iframe_element = document.createElement('iframe'),
        left_offset,
        top_offset;

      window[callback_function_name] = function (parameters) {
        var status;

        setTimeout(function () {
          container.removeChild(iframe_element);
        }, 0);
        if (parameters.no_token_specified) {
          status = 'no_token_specified';
        } else if (parameters.invalid_token) {
          status = 'invalid_token';
        } else if (parameters.not_logged_in) {
          status = 'not_logged_in';
        } else if (parameters.logged_out) {
          status = 'logged_out';
        }
        if (callback && typeof callback == 'function') {
          callback(status);
        }
        fire_event('logout');
      };

      if (navigator.userAgent.match(/MSIE/)) {
        left_offset = (screen.width / 2) - (1240 / 2);
        top_offset = (screen.height / 2) - (480 / 2);

        window.open(site_url + 'api/js-sdk/authorize?sdk_key=' + this.sdk_key + '&token=' + oauth_token + '&_method=delete&callback=' + callback_function_name,
                    '500px_logout_window',
                    'width=1240,height=480,left=' + left_offset + ',top=' + top_offset + ',menu=no,location=yes,scrollbars=no,status=yes,toolbar=yes');
      } else {
        iframe_element.src = site_url + 'api/js-sdk/authorize?sdk_key=' + this.sdk_key + '&token=' + oauth_token + '&_method=delete&callback=' + callback_function_name;
      }
      container.appendChild(iframe_element);
    };

    // Private methods

    toParam = function (object) {
      var string_parts = [], property;
      for (property in object) {
        if (object.hasOwnProperty(property)) {
          string_parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(object[property]));
        }
      }

      return string_parts.join('&');
    };

    fire_event = function (event_name) {
      if (events[event_name]) {
        var i;
        for (i = 0; i < events[event_name].length; i++) {
          events[event_name][i].call(self);
        }
      }
    };

    login_callback = function (callback, parameters) {
      if (parameters.denied && callback && typeof callback == 'function') {
        fire_event('authorization_cancelled');
        callback.call(self, 'denied');
      } else if (parameters.token) {
        oauth_token = parameters.token;
        fire_event('authorization_obtained');
        if (callback && typeof callback == 'function') {
          callback.call(self, 'authorized');
        }
      }
    };

    handle_api_callback = function (callback) {
      return function (data) {
        var response = new Response(data);
        callback.call(self, response);
        if (data.status && data.status == 401) {
          oauth_token = null;
          fire_event('logout');
        }
      };
    };

    random_method_name = function () {
      return '_500pxCallback' + String(Math.round(Math.random() * 100000000));
    };

    // Bind all public methods

    public_methods = [
      'init',
      'api',
      'login',
      'authorize',
      'ensureAuthorization',
      'getAuthorizationStatus',
      'on',
      'off',
      'logout'];

    bind_method = function (method) {
      return function () {
        method.apply(self, arguments);
      };
    };

    for (i = 0; i < public_methods.length; i++) {
      method_name = public_methods[i];
      original_method = this[method_name];
      this[method_name] = bind_method(original_method);
    }
  };

  window._500px = new _500pxSDK();

  Response = function (data) {
    this.success = true;

    if (data.status && data.status != 200 && data.error) {
      this.success = false;
      this.error_message = data.error;
      this.status = data.status;
    }
    if (!this.status) {
      this.status = 200;
    }

    this.error = !this.success;
    this.data = data;
  };
}());



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var Modal = __webpack_require__(9);
var Util = __webpack_require__(10);

/*
* 应用层组织各模块，以及页面逻辑的实现
*/
function Application(waterfall){
	this.waterfall = waterfall;
	this.bounce = $('#bounce');
	this.modal = new Modal();
	this.page = 0;
	this.loading = false;

	this.load();

	addEvent(window, 'scroll', this.scroll.bind(this));
	addEvent(document, 'click', this.click.bind(this));
}
//加载图片资源
Application.prototype.load = function(){
	this.bounce.classList.remove('hide');
	this.loading = true;
	Util.getPhotos(this.page++, this.loaded.bind(this));
}
//加载结束
Application.prototype.loaded = function(photos){
	this.bounce.className += ' hide';
	this.loading = false;
	this.waterfall.append(photos);
}
//滚动加载
Application.prototype.scroll = function(){
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	//滚动走的高度＋浏览器窗口高度 >= body页面高度(其实就是高度最大的那一栏的高度) 时请求资源
	if(scrollTop + innerHeight + 200 >= document.body.clientHeight && !this.loading){
		this.load();
	}
}
//点击显示大图
Application.prototype.click = function(event){
	var target = event.target || event.srcElement;
	if(target && target.tagName === 'img'.toUpperCase()){
		this.modal.show(target.src, target.dataset.large, target.dataset.radio);
	}
}

module.exports = Application;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
* Bucket木桶布局
*/
function Bucket(ele, minHeight){
	this.ele = ele;
	this.minHeight = minHeight || 300;
	this.minRadio = this.ele.clientWidth / this.minHeight;
	this.gap = 8;
	this.photos = [];
}
//获得完整的一行图片数据，不满一行的数据留着下一次用
Bucket.prototype.getRows = function(photos){
	photos = this.photos.concat(photos);//合并上次剩下的图片
	var radio = 0;
	var rows = [];
	var row_photos = [];//存放要放在一行的图片数据
	for(var i = 0; i < photos.length; i++){
		row_photos.push(photos[i]);
		radio += Number(photos[i].aspect_ratio);
		if(radio > this.minRadio){//累加的长宽比大于minRadio时，则之前累加的图片作为一行
			rows.push({
				radio: radio,
				photos: row_photos,
			})
			row_photos = [];
			radio = 0;
		}
	}
	this.photos = row_photos;//剩下的图片留到下一次
	return rows;
}
//渲染布局
Bucket.prototype.append = function(photos){
	var rows = this.getRows(photos);
	for(var i = 0; i < rows.length; i++){
		var row = rows[i];
		var actualWidth = this.ele.clientWidth - (row.photos.length+1) * this.gap;
		var $row = document.createElement('div');
		$row.className = 'gallery-row';
		$row.style.height = actualWidth / row.radio + 'px';
		$row.innerHTML = row.photos.reduce(function(html, photo){
			html += '<div class="gallery-item">' + 
						'<img title=' + photo.name + ' data-radio=' + photo.aspect_ratio +
							 ' data-large=' + photo.large_url + ' src=' + photo.image_url + '>' + 
						'<div class="gallery-infor">' + photo.name + 
						'</div>' + 
					'</div>';
			return html;
		}, '');
		this.ele.appendChild($row);
	}
}

module.exports = Bucket;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./bucket.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./bucket.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./loading.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./loading.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./modal.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./modal.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./waterfall.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./waterfall.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

/*
* 图片大图显示模块
*/
function Modal(){
	this.$modal = document.createElement('div');
	this.$modal.className = 'modal';
	this.$modal.innerHTML =
		'<div class="bounce">' +
		  	'<span></span>' +
		    '<span></span>' +
		'</div>' +
		'<div class="modal-container">' + 
			'<img class="modal-img">' +
		'</div>';
	
	this.$container = $('.modal-container', this.$modal)[0];
	this.$bounce = $('.bounce', this.$modal)[0];
	this.$img = $('img', this.$modal)[0];
	document.body.appendChild(this.$modal);

	this.init();
}
Modal.prototype.init = function(){
	var self = this;
	//hide
	addEvent(this.$modal, 'click', function(event){
		//点击图片返回img元素，点击图片周围返回modal
		if(event.target == self.$modal){
			self.$modal.className = self.$modal.className.replace(/ active/, '');
			document.body.classList.remove('noscroll');
			// self.$container.classList.remove('show');
		}
	});
	this.$img.onload = function(){
		self.$bounce.style.zIndex = -1;
		// self.$container.className += ' show';//本来想等大图全部加在完成再显示的，但是像素太大加载很慢会等很久
	}
}
Modal.prototype.show = function(url, burl, radio){
	document.body.className += ' noscroll';
	this.$modal.className += ' active';
	if(this.$img.src != url){
		this.$img.src = url;
		this.$bounce.style.zIndex = 1;

		//因为弹出层显示时要禁止页面向下滑动，所以要对两种尺寸的图片分别处理
		var windowRadio = innerWidth / innerHeight;
		if(windowRadio > radio){//portrait人像图
			this.$container.style.width = (innerHeight - 100) * radio + 'px';
		}else{//landscape风景图
			this.$container.style.width = (innerWidth - 100) + 'px';
			//因为图片可能会过于扁，不处在屏幕正中间没法覆盖loading效果
			this.$container.style.marginTop = (innerHeight - (innerWidth - 100) / radio) / 2 + 'px'
		}

		this.$img.style.height = parseInt(this.$container.style.width) / radio + 'px';

		var image = new Image();
		image.src = burl;
		image.onload = () => {
			this.$img.src = burl;
		}
	}
}

module.exports = Modal;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

/*
* 实现获取图片，加载完毕渲染页面，依赖文件500px.js
*/
function getPhotos(page, callback){
	_500px.api('/photos', { feature: 'popular', sort: 'created_at', page: page, image_size: [30,1080], 
		include_store: 'store_download', include_states: 'voted'}, function (response) {

		var data = response.data.photos;
		loadImage(data, callback);
	});
}	

function loadImage(data, callback){
	var photos = [];
	var cot = 20;//当20张图片都加载完执行回调函数
	for(var i = 0; i < data.length; i++){
		photos[i] = new Object();
		photos[i].name = data[i].name === 'Untitled' ? 'Picture' : data[i].name;
		photos[i].aspect_ratio = data[i].width / data[i].height;//宽高比
		photos[i].image_url = data[i].image_url;
		photos[i].large_url = data[i].images[1].url;//高清图url
		photos[i].$img = new Image();
		photos[i].$img.src = data[i].image_url;
		photos[i].$img.onload = function(){
			cot--;
			if(!cot){
				callback(photos);
			}
		}
	}
}

module.exports = {
	getPhotos: getPhotos
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "*{\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n\tfont-family: \"Microsoft YaHei\";\r\n\tbox-sizing: border-box;\r\n}\r\nbody{\r\n\twidth: 100%;\r\n\toverflow-y: scrol;\r\n}\r\n#gallery {\r\n  margin-top: 8px;\r\n}\r\n.gallery-row{\r\n\tmargin-bottom: 8px;\r\n\toverflow: hidden;\r\n\twhite-space: nowrap;\r\n\tpadding-right: 8px;\r\n}\r\n.gallery-item{\r\n\theight: 100%;\r\n\tdisplay: inline-block;\r\n\tmargin-left: 8px;\r\n\tposition: relative;\r\n}\r\n.gallery-infor{\r\n\twidth: 100%;\r\n\tbackground-image: linear-gradient(transparent 77%, rgba(0, 0, 0, 0.33));\r\n\tcolor: #fff;\r\n\tposition: absolute;\r\n\tbottom: 0;\r\n\tdisplay: none;\r\n\tpadding: 10px;\r\n\toverflow: hidden;\r\n\ttext-overflow: ellipsis;\r\n\tcursor: default;\r\n}\r\n.gallery-item:hover .gallery-infor{\r\n\tdisplay: block;\r\n}\r\nimg{\r\n\tobject-fit: cover;\r\n\theight: 100%;\r\n\tcursor: zoom-in;\r\n}\r\n.noscroll{\r\n\toverflow: hidden;\r\n}\r\n.hide{\r\n\tdisplay: none;\r\n}", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".bounce{\r\n\twidth: 40px;\r\n\theight: 40px;\r\n\tmargin: 50px auto;\r\n\tposition: relative;\r\n}\r\n.bounce span{\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\tbackground-color: #3498db;\r\n\topacity: 0.6;\r\n\tborder-radius: 50%;\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\tleft: 0;\r\n\t-webkit-animation: bounce 2s ease-in-out infinite;\r\n  \tanimation: bounce 2s ease-in-out infinite;\r\n}\r\n.bounce span:nth-child(2){\r\n\tanimation-delay: -1s;\r\n\t-webkit-animation-delay: -1s;\r\n}\r\n@keyframes bounce{\r\n\t0%, 100%{\r\n\t\ttransform: scale(0);\r\n\t\t-webkit-transform: scale(0);\r\n\t}\r\n\t50%{\r\n\t\ttransform: scale(1.0);\r\n\t\t-webkit-transform: scale(1.0);\r\n\t}\r\n}\r\n@-webkit-keyframes bounce{\r\n\t0%, 100%{\r\n\t\ttransform: scale(0.0);\r\n\t\t-webkit-transform: scale(0.0);\r\n\t}\r\n\t50%{\r\n\t\ttransform: scale(1.0);\r\n\t\t-webkit-transform: scale(1.0);\r\n\t}\r\n}", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".modal{\r\n\tposition: fixed;\r\n\ttop: 0;\r\n\tleft: 0;\r\n\tright: 0;\r\n\tbottom: 0;\r\n\toverflow: auto;\r\n\tdisplay: none;\r\n}\r\n.modal.active{\r\n\tbackground-color: rgba(0, 0, 0, .6);\r\n\tdisplay: block;\r\n}\r\n.modal-container{\r\n\tmargin: 50px auto;\r\n  \tbox-shadow: 0 5px 15px rgba(0, 0, 0, .5);\r\n  \t/*visibility: hidden;*/\r\n}\r\n.modal-img{\r\n\twidth: 100%;\r\n\tdisplay: block;\r\n\tobject-fit: cover;\r\n}\r\n.modal .bounce{\r\n\tposition: absolute;\r\n\ttop: 50%;\r\n\tleft: 50%;\r\n\tmargin-left: -20px;\r\n\tmargin-top: -20px;\r\n}\r\n.noscroll{\r\n\toverflow: hidden;\r\n}\r\n.modal .show{\r\n\tvisibility: visible;\r\n}", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "*{\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n\tfont-family: \"Microsoft YaHei\";\r\n\tbox-sizing: border-box;\r\n}\r\n\r\nbody {\r\n  background-color: #f0f0f0;\r\n  overflow-y: scroll;\r\n}\r\n\r\n#gallery {\r\n  margin-top: 16px;\r\n}\r\n\r\n.gallery-column {\r\n  display: inline-block;\r\n  vertical-align: top;\r\n  padding: 0 8px;\r\n  box-sizing: border-box;\r\n}\r\n\r\n.gallery-item{\r\n\tmargin-bottom: 16px;\r\n\tbox-shadow: 0 1px 3px 0 #d4d4d5;\r\n\tborder-radius: 4px;\r\n\toverflow: hidden;\r\n\tbackground-color: #fff;\r\n}\r\n.gallery-img{\r\n\tdisplay: block;\r\n\twidth: 100%;\r\n\tcursor: zoom-in;\r\n\tobject-fit:cover;\r\n}\r\n.gallery-img:hover {\r\n  opacity: 0.8;\r\n}\r\n\r\n.gallery-infor{\r\n\tpadding: 10px;\r\n\tcolor: #333;\r\n}\r\n\r\n.hide{\r\n\tdisplay: none;\r\n}", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_modal_css__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_modal_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_modal_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_loading_css__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_loading_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__css_loading_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__css_waterfall_css__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__css_waterfall_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__css_waterfall_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__css_bucket_css__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__css_bucket_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__css_bucket_css__);






__webpack_require__(2);

_500px.init({
	sdk_key: 'b68e60cff4c929bedea36ca978830c5caca790c3'
});

var Application = __webpack_require__(3);
// var Waterfall = require('./waterfall');

// var col = 2;
// if(innerWidth > 1200) col = 5;
// else if(innerWidth > 992) col = 4;
// else if(innerWidth > 768) col = 3;

// new Application(new Waterfall($('#gallery'), col));


var Bucket = __webpack_require__(4);

new Application(new Bucket($('#gallery')))

/***/ })
/******/ ]);