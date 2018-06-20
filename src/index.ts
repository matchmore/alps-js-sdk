import {Manager} from './manager';
import {IPersistenceManager} from "./persistence";
import {Client} from "./client";
import InMemoryPersistenceManager from './persistences/InMemoryPersistenceManager';
import LocalStoragePersistenceManager from './persistences/LocalStoragePersistenceManager';
import PlatformConfig from './platform';

export {
  Manager,
  
  IPersistenceManager,
  InMemoryPersistenceManager,
  LocalStoragePersistenceManager,
  Client,
  PlatformConfig,
}