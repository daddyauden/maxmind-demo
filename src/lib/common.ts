import ipRegex from "ip-regex";

export const verifyIp = (ips: string | string[]) => {
    if (typeof ips === "string") {
        return ipRegex.v4({ exact: true }).test(ips);
    }

    if (Array.isArray(ips)) {
        let hasInvalid = false;

        for (const ip of ips) {
            if (!verifyIp(ip)) {
                hasInvalid = true;
                break;
            }
        }

        return !hasInvalid;
    }

    return false;
};
