import { useState, FormEvent, ChangeEvent } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { verifyIp } from "lib/common";
import GeoipService from "services/geoip";
import { GeoCity } from "interfaces/city";

const Home: NextPage = () => {
    const [ips, setIps] = useState("");
    const [data, setData] = useState([]);
    const [message, setMessage] = useState("");

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setIps(event.target.value);
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (ips === "") {
            setMessage("You must provide a valid IP address to look up.");
            return;
        } else {
            const ipsArr = ips
                .trim()
                .split(/\s+|,|\n｜\r/)
                .filter((item: string) => item);

            if (!verifyIp(ipsArr)) {
                setMessage("You must provide a valid IP address to look up.");

                return;
            }

            const res = await GeoipService("api/geoip", ipsArr);

            if (res.status === "succeeded") {
                setMessage("");
                setData(res.data);
            } else if (res.status === "failed") {
                setMessage(res.data);
            }
        }
    };

    const loopData = (data: GeoCity[]) => {
        return data.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 my-8">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-center">
                            Country Code
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Postal Code
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            City Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Time Zone
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Accuracy Radius
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((city: GeoCity, index: number) => (
                        <tr
                            key={index}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-white"
                        >
                            <td className="px-6 py-4 text-center">
                                {city.countryCode}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {city.postalCode}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {city.cityName}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {city.timeZone}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {city.accuracyRadius}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : null;
    };

    return (
        <div className="container mx-auto">
            <Head>
                <meta
                    httpEquiv="Content-Type"
                    content="text/html; charset=utf-8"
                />
                <meta
                    name="description"
                    content="Sample GeoIP2 databases. Geolocate up to 25 IP addresses now."
                />
                <title>GeoIP2 Databases Demo | MaxMind</title>
            </Head>

            <main className="max-w-4xl mx-auto text-center">
                <h1 className="text-lg font-bold py-10 text-sky-400">
                    GeoIP2 Databases Demo
                </h1>

                <label className="block mb-4" htmlFor="demo_ip">
                    IP Addresses
                </label>

                <form
                    id="demo_form"
                    className="max-w-xl mx-auto"
                    onSubmit={onSubmit}
                >
                    <textarea
                        className="w-full h-48 border border-gray-100 rounded-sm outline outline-1 focus:outline-blue-400 p-2"
                        id="demo_ips"
                        name="demo_ips"
                        value={ips}
                        onChange={handleChange}
                    ></textarea>

                    <div className="my-4">
                        Enter up to IP addresses separated by spaces or commas.
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        id="demo_submit"
                    >
                        Submit
                    </button>
                </form>

                <div className="container">
                    {message ? (
                        <div className="message p-4 text-gray-700 text-left">
                            {message}
                        </div>
                    ) : (
                        loopData(data)
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
