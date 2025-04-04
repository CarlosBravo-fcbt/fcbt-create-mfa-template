package farmview

import (
    "fcbt.farmview/common"
)

{{appName}}: _app  //provides a name other objects can reference this app in code

let _context=context
let _app=common.#WebApp & {
    context: _context & common.#Context_v1
    url: string     //Defined in #WebApp, redeclared here to allow local reference

    name: "{{appName}}"
    image: "/images/farmview/ui/{{appName}}:latest"
    path: "/{{appName}}"

    env: {
        {{appName_upper}}_HOST: url
        DEVSERVER_PORT: "80"
        REACT_APP_SETTINGS_API: "\(settingsApi.url)/v1/"
        REACT_APP_ENV: context.name
        REACT_APP_RUNNING_MODE: constants.runningMode.standalone
        AUTH_HOST: auth.url
        REACT_APP_AUTH_API: "\(authApi.url)/v1/"
        REACT_APP_AUTH_SECURITY_TYPE: constants.securityType.none
    }            
}

//Add manifests and ingressPath to the inventory
inventory: items: "\(_app.name)": _app.kubeobjects
inventory: ingressPaths: "\(_app.path)": {
    serviceName: _app.name
    servicePort: 80
}
