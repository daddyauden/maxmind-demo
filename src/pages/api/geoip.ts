import type { NextApiRequest, NextApiResponse } from "next";

import { Reader, ReaderModel } from "@maxmind/geoip2-node";

import { GeoCity } from "interfaces/city";

type Data = {
    status: "failed" | "succeeded";
    data: GeoCity[] | string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { ips }: { ips: string[] } = JSON.parse(req.body);

    if (req.method === "POST") {
        try {
            const maxmind: ReaderModel = await Reader.open(
                "src/lib/maxmind/geolite2-city.mmdb"
            );

            const data = ips.map((ip: string) => {
                const { country, postal, city, location }: any =
                    maxmind.city(ip);

                return {
                    countryCode: country?.isoCode || "Unknown",
                    postalCode: postal?.code || "Unknown",
                    cityName: city?.names?.en || "Unknown",
                    timeZone: location?.timeZone || "Unknown",
                    accuracyRadius: location?.accuracyRadius || "Unknown",
                };
            });

            res.status(200).json({
                status: "succeeded",
                data: data,
            });
        } catch (error: any) {
            res.status(200).json({
                status: "failed",
                data: error.message,
            });
        }
    } else {
        res.status(200).json({
            status: "failed",
            data: "Method Not Allowed",
        });
    }
}
