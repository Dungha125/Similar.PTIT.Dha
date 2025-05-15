import React from 'react';

function PermissionWrapper({ permission, children })  {
    // if (!permission) return <div className={"btn btn-secondary text-white"}>Permission err!</div>;
    if (!permission) return null;
    return <>{children}</>;
}

export default PermissionWrapper;