export default async (path: string, data: string | string[]) => {
    const res = await fetch(path, {
        method: "POST",
        body: JSON.stringify({
            ips: data,
        }),
    });

    return await res.json();
};
