export interface IScope {
  register<T>(key: string, registration: (scope: IScope) => T): void;
  find<T>(key: string): T;
  get<T>(key: string): T;
}


export class Scope implements IScope {
  isDisposed(): boolean {
    return this.disposed;
  }

  private registrations  = {};
  private instances = {};
  private disposed = false;

  register<T>(key: string, registration: (scope: IScope) => T): void {
    this.registrations[key] = registration;
  }

  find<T>(key: string): T {
    var value: T = null;

    if (key in this.instances)
      return this.instances[key];

    var registration = this.registrations[key];
    if (!registration)
      return value;

    try {
      value = registration(this);
    }
    catch (e) {
      console && console.log && console.log(e);
    }
    finally {
      this.instances[key] = value;
    }
    return value;
  }

  get<T>(key: string): T {
    var value: T = null;

    if (key in this.instances) {
      if (this.instances[key])
        return this.instances[key];
      else
        throw `Instance of type '${key}' is not registered.`;
    }

    var registration = this.registrations[key];
    if (!registration)
      throw `Instance of type '${key}' is not registered.`;

    try {
      this.instances[key] = value = registration(this);
    }
    catch (error) {
      throw `Failed to resolve dependency of type ${key}. -> ` + error;
    }
    return value;
  }

  // killInstances() {
  //   for (var key in this.instances) {
  //     var item = this.instances[key];
  //     if (item['dispose'] && isFunction(item['dispose'])) {
  //       try {
  //         item['dispose']();
  //       }
  //       catch (e) {}
  //     }
  //   }
  //   this.instances = {};
  // }

  // dispose() {
  //   this.killInstances();
  //   this.disposed = true;
  // }
}

const scope = new Scope();

export default scope;
