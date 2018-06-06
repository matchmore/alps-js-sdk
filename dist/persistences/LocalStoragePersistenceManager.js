"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const persistence_1 = require("../persistence");
const platform_1 = require("../platform");
const storageKey = '@matchmoreSdk:data';
class LocalStoragePersistenceManager {
    constructor() {
        this._devices = [];
        this._publications = [];
        this._subscriptions = [];
    }
    devices() {
        return this._devices;
    }
    publications() {
        return this._publications;
    }
    subscriptions() {
        return this._subscriptions;
    }
    add(entity) {
        if (persistence_1.MatchmoreEntityDiscriminator.isDevice(entity)) {
            let device = entity;
            this._devices.push(device);
            this.save();
            return;
        }
        if (persistence_1.MatchmoreEntityDiscriminator.isPublication(entity)) {
            let pub = entity;
            this._publications.push(pub);
            this.save();
            return;
        }
        if (persistence_1.MatchmoreEntityDiscriminator.isSubscription(entity)) {
            let sub = entity;
            this._subscriptions.push(sub);
            this.save();
            return;
        }
    }
    remove(entity) {
        if (persistence_1.MatchmoreEntityDiscriminator.isDevice(entity)) {
            let device = entity;
            if (device.id == this._defaultDevice.id)
                throw new Error("Cannot delete default device");
            this._devices = this._devices.filter(d => device.id != d.id);
            this.save();
            return;
        }
        if (persistence_1.MatchmoreEntityDiscriminator.isPublication(entity)) {
            let pub = entity;
            this._publications = this._publications.filter(d => pub.id != d.id);
            this.save();
            return;
        }
        if (persistence_1.MatchmoreEntityDiscriminator.isSubscription(entity)) {
            let sub = entity;
            this._subscriptions = this._subscriptions.filter(d => sub.id != d.id);
            this.save();
            return;
        }
    }
    defaultDevice() {
        return this._defaultDevice;
    }
    addDevice(device, isDefault) {
        this.add(device);
        if (isDefault)
            this._defaultDevice = device;
        this.save();
    }
    onLoad(onLoad) {
        this._onLoad = onLoad;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataString = yield platform_1.default.storage.load(storageKey);
            const data = JSON.parse(dataString);
            if (data) {
                this._devices = data.devices.map((deviceObject) => deviceObject);
                this._subscriptions = data.subscriptions.map((subscriptionObject) => subscriptionObject);
                this._publications = data.publications.map((publicationObject) => publicationObject);
                this._defaultDevice = data.defaultDevice;
            }
            return true;
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const saveData = {
                devices: this._devices,
                subscriptions: this._subscriptions,
                publications: this._publications,
                defaultDevice: this._defaultDevice,
            };
            return yield platform_1.default.storage.save(storageKey, JSON.stringify(saveData));
        });
    }
}
exports.default = LocalStoragePersistenceManager;
