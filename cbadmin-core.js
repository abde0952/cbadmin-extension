(async () => {
  const status = document.getElementById("status");
  const time = new Date().toISOString();

  chrome.enterprise.deviceAttributes.getDeviceSerialNumber(async (serial) => {
    if (!serial) {
      status.textContent = "❌ Serienummer ikke tilgængeligt";
      return;
    }

    try {
      const res = await fetch("https://ipinfo.io/json?token=DIN_TOKEN_HER");
      const data = await res.json();
      const [latitude, longitude] = data.loc.split(",");

      const payload = { serial, latitude, longitude, time };

      const response = await fetch("https://192.168.0.180:3000/modtag-lokation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        status.textContent = "✅ Lokation sendt via IP!";
      } else {
        status.textContent = "❌ Fejl ved afsendelse";
      }

    } catch (err) {
      console.error(err);
      status.textContent = "❌ IP-lokation fejlede";
    }
  });
})();
