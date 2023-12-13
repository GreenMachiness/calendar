useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";
    script.async = true;
    script.onload = () => {
      window.__TOMORROW__ = {
        renderWidget: () => {
          const tomorrowWidget = document.createElement("div");
          tomorrowWidget.classList.add("tomorrow");
          tomorrowWidget.setAttribute("data-location-id", "127210");
          tomorrowWidget.setAttribute("data-language", "EN");
          tomorrowWidget.setAttribute("data-unit-system", "IMPERIAL");
          tomorrowWidget.setAttribute("data-skin", "light");
          tomorrowWidget.setAttribute("data-widget-type", "upcoming");
          tomorrowWidget.style.paddingBottom = "22px";
          tomorrowWidget.style.position = "relative";

          const tomorrowLink = document.createElement("a");
          tomorrowLink.href = "https://www.tomorrow.io/weather-api/";
          tomorrowLink.rel = "nofollow noopener noreferrer";
          tomorrowLink.target = "_blank";
          tomorrowLink.style.position = "absolute";
          tomorrowLink.style.bottom = "0";
          tomorrowLink.style.transform = "translateX(-50%)";
          tomorrowLink.style.left = "50%";

          const tomorrowImage = document.createElement("img");
          tomorrowImage.alt = "Powered by the Tomorrow.io Weather API";
          tomorrowImage.src =
            "https://weather-website-client.tomorrow.io/img/powered-by.svg";
          tomorrowImage.width = "250";
          tomorrowImage.height = "18";

          tomorrowLink.appendChild(tomorrowImage);
          tomorrowWidget.appendChild(tomorrowLink);

          const weatherContainer = document.getElementById("weather-container");
          weatherContainer.appendChild(tomorrowWidget);
        },
      };

      if (!document.getElementById("tomorrow-sdk")) {
        const fjs = document.getElementsByTagName("script")[0];
        script.id = "tomorrow-sdk";
        fjs.parentNode.insertBefore(script, fjs);
      } else {
        window.__TOMORROW__.renderWidget();
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="weather-container"></div>;
}
