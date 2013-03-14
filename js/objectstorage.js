/*global Storage:false */
/*jshint eqnull:true */

/*
 * Extends Storage object to support storing JSON-encoded objects.
 * (c) 2012 PlasticPanda.com
 * License: MIT
 */

(function (Storage) {
    'use strict';
    
    // Set key to the given value (must be JSON encodable)
    Storage.prototype.setObject = function (key, value) {
        this.setItem(key, JSON.stringify(value));
    };
    
    // Get the object stored at key
    Storage.prototype.getObject = function (key) {
        var value = this.getItem(key);
        
        if (value == null || value === 'undefined') {
            return null;
        } else {
            try {
                return JSON.parse(value);
            } catch (e) {
                throw new Error('getObject error: value for key `' + key + '` is not a valid JSON string. You should use Storage::getItem to retrieve that.');
            }
        }
    };
    
    // Append a value/object to a stored object property (must be an array)
    Storage.prototype.appendObject = function (key, appendValue) {
        var item = this.getObject(key);
   
        if ('undefined' === typeof item || item == null) {
            item = [appendValue];
        } else {
            if ('function' === typeof item.push) {
                item.push(appendValue);
            } else {
                throw new Error('appendObjectProperty error: Appending to a non-array.');
            }
        }
        
        this.setObject(key, item);         
    };    
    
    Storage.prototype.removeObject = function (key) {
        return this.removeItem(key);
    };
    
    // Set a property of a stored object
    Storage.prototype.setObjectProperty = function (key, objKey, objValue) {
        var item = this.getObject(key);
        
        if (item === null) {
            item = {};
        }
        
        item[objKey] = objValue;
        this.setObject(key, item);
    };
    
    // Append a value/object to a stored object property (must be an array)
    Storage.prototype.appendObjectProperty = function (key, objKey, appendValue) {
        var item = this.getObject(key)[objKey];
 
        if ('undefined' === typeof item || item == null) {
            item = [appendValue];
        } else {       
            if ('function' === typeof item.push) {
                item.push(appendValue);
            } else {
                throw new Error('appendObjectProperty error: Appending to a non-array.');
            }
        }
        
        this.setObjectProperty(key, objKey, item);         
    };
    
    Storage.prototype.getObjectProperty = function (key, objKey) {
        var obj = this.getObject(key);
        if (obj != null) {
            if (obj[objKey] == null || obj[objKey] === 'undefined') {
                return null;
            } else {
                return obj[objKey];
            }
        } else {
            return null;
        }
    };

})(Storage);
