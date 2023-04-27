export function Injector() {
    let returnValue = {};
    let registrations = {};

    returnValue.getService = function (serviceType) {
        let registration = registrations[serviceType];

        if (registration) {
            if (registration.isFactory === true) {
                return registration.factory();
            } else {
                return registration.singleton;
            }
        }

        return null;
    };

    returnValue.setup = function (serviceType, instance) {
        registrations[serviceType] = { isFactory: false, singleton: instance };
    }

    returnValue.setupFactory = function (serviceType, invocation) {
        registrations[serviceType] = { isFactory: true, factory: invocation };
    }

    return returnValue;
}