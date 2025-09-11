const ipHeaderKeys = [
  "cf-connecting-ip",
  "client-ip",
  "clientip",
  "fastly-client-ip",
  "forwarded",
  "forwarded-for",
  "forwarded-for-ip",
  "incap-client-ip",
  "real-ip",
  "true-client-ip",
  "x-cisco-bbsm-clientip",
  "x-client-ip",
  "x-clientip",
  "x-forward-for",
  "x-forwarded",
  "x-forwarded-by",
  "x-forwarded-for",
  "x-forwarded-for-original",
  "x-forwarder-for",
  "x-forwarder-ip",
  "x-ip",
  "x-originally-forwarded-for",
  "x-real-ip",
  "x-wap-network-client-ip",
  "xxx-real-ip"
];

export default function clientIp(headers) {
  const ipHeaders = [];

  for (const [key, value] of headers.entries()) {
    if (ipHeaderKeys.includes(key.toLowerCase())) {
      const ip = value.includes(",") ? value.split(",")[0] : value;
      
      if (!ipHeaders.includes(ip)) {
        ipHeaders.push({ key, ip });
      }
    }
  }

  if (ipHeaders.length > 1) {
    let index = 0;

    while (index < ipHeaders.length - 1) {
      const key = ipHeaders[index].key.toLowerCase();

      if (key.includes("client-ip")) {
        return ipHeaders[index].ip;
      } else if (key.includes("forwarded")) {
        return ipHeaders[index].ip;
      } else {
        index += 1;
      }
    }
    
    return ipHeaders[index].ip;
  } else {
    return ipHeaders[0]?.ip;
  }
}
