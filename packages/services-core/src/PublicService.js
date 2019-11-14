import ServiceBase from './ServiceBase';
import ServiceType from './ServiceType';

/**
 *
 */
class PublicService extends ServiceBase {
  /**
   * @param {string} name
   * @param {string[]} dependencies
   */
  constructor(name, dependencies = []) {
    super(ServiceType.PUBLIC, name, dependencies);
  }
}

export default PublicService;
