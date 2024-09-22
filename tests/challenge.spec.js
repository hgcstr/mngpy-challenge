import { test, expect } from "@playwright/test";
import GoogleMapsPage from "../pages/googleMapsPage";
import { getZoomLevelFromUrl } from "../utilities/utils";

const gMapsEnglishUrl = "/maps?hl=en";

const testCities = {
  paris: {
    name: "Paris",
    urlPlaceName: "/place/Paris,+France",
  },
  newYork: {
    name: "New York",
    urlPlaceName: "/place/New+York,+NY",
  },
  lima: {
    name: "Lima",
    urlPlaceName: "/place/Lima,+Peru",
  },
  london: {
    name: "London",
    urlPlaceName: "/place/London,+UK",
  },
  berlin: {
    name: "Berlin",
    urlPlaceName: "/Berlin/",
  },
  invalid: {
    name: "6td46t634d",
    urlPlaceName: "none",
  },
};

const nearbyValues = ["Restaurants", "Hotels", "Bars and pubs"];
const zoomLevelLimits = { min: 3, max: 21 };

async function setupGoogleMaps(page, city) {
  await page.goto(gMapsEnglishUrl);
  const googleMapsPage = new GoogleMapsPage(page);
  await googleMapsPage.rejectAllCookies();
  await googleMapsPage.searchCity(city);
  return googleMapsPage;
}

test.describe("Happy tests", () => {
  test("AC 1: Verify city headline displays correctly after search", async ({
    page,
  }) => {
    const googleMapsPage = await setupGoogleMaps(page, testCities.paris.name);
    const headlineText = await googleMapsPage.getHeadlineText();
    expect(headlineText).toBe(testCities.paris.name);
  });

  test("AC 2: Verify destination field content after selecting directions", async ({
    page,
  }) => {
    const googleMapsPage = await setupGoogleMaps(page, testCities.london.name);
    const headlineText = await googleMapsPage.getHeadlineText();
    expect(headlineText).toBe(testCities.london.name);

    await googleMapsPage.clickDirectionsButton();
    const destinationText = await googleMapsPage.getDestinationText();
    expect(destinationText).toContain(testCities.london.name);
  });

  test("AC 3: Verify city headline remains after zoom", async ({ page }) => {
    const googleMapsPage = await setupGoogleMaps(page, testCities.newYork.name);
    const headlineText = await googleMapsPage.getHeadlineText();
    expect(headlineText).toBe(testCities.newYork.name);

    await page.waitForTimeout(2000);
    let currentUrl = await page.url();
    expect(currentUrl).toContain(testCities.newYork.urlPlaceName);

    let initialZoomLevel = getZoomLevelFromUrl(currentUrl);
    await googleMapsPage.clickZoomIn();
    await page.waitForTimeout(2000);

    let newUrl = await page.url();
    let newZoomLevel = getZoomLevelFromUrl(newUrl);
    expect(newZoomLevel).toBeGreaterThan(initialZoomLevel);
  });

  test("AC 4: Verify nearby suggestions", async ({ page }) => {
    const googleMapsPage = await setupGoogleMaps(page, testCities.berlin.name);
    const headlineText = await googleMapsPage.getHeadlineText();
    expect(headlineText).toBe(testCities.berlin.name);

    await googleMapsPage.clickNearbyButton();
    const values = await googleMapsPage.getNearbySuggestions();
    expect(values).toEqual(nearbyValues);
  });
});

test.describe("Unhappy tests", () => {
  test("AC 5: Verify Unsuccessful Search", async ({ page }) => {
    const googleMapsPage = await setupGoogleMaps(page, testCities.invalid.name);
    const canNotFindText = await googleMapsPage.getCantFindLabelText();
    expect(canNotFindText).toBe(
      `Google Maps can't find ${testCities.invalid.name}`
    );
  });
});

test.describe("Boundary tests", () => {
  test("AC 6: Verify Zoom Limits", async ({ page }) => {
    const googleMapsPage = await setupGoogleMaps(page, testCities.lima.name);
    const headlineText = await googleMapsPage.getHeadlineText();
    expect(headlineText).toBe(testCities.lima.name);

    await page.waitForTimeout(3000);
    let currentUrl = await page.url();
    let initialZoomLevel = getZoomLevelFromUrl(currentUrl);

    await googleMapsPage.zoomToMaxOrMin(
      initialZoomLevel,
      zoomLevelLimits,
      "in"
    );
    await page.waitForTimeout(500);
    const zoomInButton = await googleMapsPage.getZoomInButton();
    const isZoomInDisabled = await zoomInButton.isDisabled();
    expect(isZoomInDisabled).toBe(true);

    await page.waitForTimeout(3000);
    currentUrl = await page.url();
    initialZoomLevel = getZoomLevelFromUrl(currentUrl);

    await googleMapsPage.zoomToMaxOrMin(
      initialZoomLevel,
      zoomLevelLimits,
      "out"
    );
    await page.waitForTimeout(500);
    const zoomOutButton = await googleMapsPage.getZoomOutButton();
    const isZoomOutDisabled = await zoomOutButton.isDisabled();
    expect(isZoomOutDisabled).toBe(true);
  });
});

test.describe("Non functional tests", () => {
  test("Verify page load time is less than 2 seconds", async ({ page }) => {
    const startTime = Date.now();
    await page.goto(gMapsEnglishUrl);
    await page.waitForLoadState("load");
    const loadTime = Date.now() - startTime;

    console.log(`Current page load time: ${loadTime} ms`);
    expect(loadTime).toBeLessThan(2000);
  });
});
