(async () => {
  const status = document.getElementById("status");
  status.textContent = "📡 Henter GPS-lokation...";
  const time = new Date().toISOString();

  chrome.enterprise.deviceAttributes.getDeviceSerialNumber((serial) => {
    if (!serial) {
      status.textContent = "❌ Serienummer ikke tilgængeligt";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const payload = { serial, latitude, longitude, time };

        try {
          const response = await fetch("https://cbadmin-backend.netlify.app/.netlify/functions/modtager-lokation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            status.textContent = "✅ GPS-lokation sendt!";
          } else {
            status.textContent = "❌ Fejl ved afsendelse";
          }
        } catch (err) {
          console.error("Fejl ved fetch:", err);
          status.textContent = "❌ Netværksfejl";
        }
      },
      (error) => {
        console.error("Geolocation-fejl:", error);
        status.textContent = "❌ GPS-lokation blev nægtet";
      }
    );
  });
})();

