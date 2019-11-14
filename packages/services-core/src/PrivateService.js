import ServiceBase from './ServiceBase';
import ServiceType from './ServiceType';

/**
 *
 */
class PrivateService extends ServiceBase {
  /**
   * @param {string} name
   * @param {string[]} dependencies
   */
  constructor(name, dependencies = []) {
    super(ServiceType.PRIVATE, name, dependencies);
  }
}

export default PrivateService;
